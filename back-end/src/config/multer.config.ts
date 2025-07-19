import multer from 'multer'
import { Request } from 'express'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'

// Define upload directories
const UPLOAD_DIRS = {
  PROFILE_PICTURES: 'uploads/profile-pictures',
  BANK_SLIPS: 'uploads/bank-slips',
  DOCUMENTS: 'uploads/documents'
} as const

// Ensure upload directories exist
Object.values(UPLOAD_DIRS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Define file size limits (in bytes)
const FILE_SIZE_LIMITS = {
  PROFILE_PICTURE: 5 * 1024 * 1024, // 5MB
  BANK_SLIP: 10 * 1024 * 1024,      // 10MB
  DOCUMENT: 10 * 1024 * 1024         // 10MB
} as const

// Define allowed mime types
const ALLOWED_MIME_TYPES = {
  PROFILE_PICTURE: ['image/jpeg', 'image/png', 'image/webp'],
  BANK_SLIP: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  DOCUMENT: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
} as const

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    let uploadPath: string

    // Determine upload path based on field name or request params
    if (file.fieldname === 'profilePicture' || req.path.includes('profile-picture')) {
      uploadPath = UPLOAD_DIRS.PROFILE_PICTURES
    } else if (file.fieldname === 'bankSlip' || req.path.includes('bank-slip')) {
      uploadPath = UPLOAD_DIRS.BANK_SLIPS
    } else {
      uploadPath = UPLOAD_DIRS.DOCUMENTS
    }

    cb(null, uploadPath)
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = path.extname(file.originalname)
    const baseName = path.basename(file.originalname, extension)
    
    // Sanitize filename
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    const filename = `${sanitizedName}-${uniqueSuffix}${extension}`
    
    cb(null, filename)
  }
})

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  let allowedTypes: readonly string[]

  // Determine allowed types based on field name or request path
  if (file.fieldname === 'profilePicture' || req.path.includes('profile-picture')) {
    allowedTypes = ALLOWED_MIME_TYPES.PROFILE_PICTURE
  } else if (file.fieldname === 'bankSlip' || req.path.includes('bank-slip')) {
    allowedTypes = ALLOWED_MIME_TYPES.BANK_SLIP
  } else {
    allowedTypes = ALLOWED_MIME_TYPES.DOCUMENT
  }

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`))
  }
}

// Profile picture upload configuration
export const profilePictureUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.PROFILE_PICTURE,
    files: 1
  }
}).single('profilePicture')

// Bank slip upload configuration
export const bankSlipUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.BANK_SLIP,
    files: 1
  }
}).single('bankSlip')

// Document upload configuration
export const documentUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.DOCUMENT,
    files: 3 // Allow multiple documents
  }
}).array('documents', 3)

// General upload configuration
export const generalUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.DOCUMENT,
    files: 1
  }
}).single('file')

// Image processing function for profile pictures
export const processProfilePicture = async (filePath: string): Promise<string> => {
  const processedPath = filePath.replace(/\.[^/.]+$/, '_processed.webp')
  
  try {
    await sharp(filePath)
      .resize(400, 400, { fit: 'cover' }) // Square crop for profile pictures
      .webp({ quality: 90 })
      .toFile(processedPath)
    
    // Delete original file after processing
    fs.unlinkSync(filePath)
    
    return processedPath
  } catch (error) {
    console.error('Error processing profile picture:', error)
    throw new Error('Failed to process profile picture')
  }
}

// Image optimization for bank slips (if they are images)
export const optimizeBankSlipImage = async (filePath: string): Promise<string> => {
  // Only process if it's an image file
  const ext = path.extname(filePath).toLowerCase()
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return filePath // Return original path for non-images (PDFs)
  }

  const optimizedPath = filePath.replace(/\.[^/.]+$/, '_optimized.webp')
  
  try {
    await sharp(filePath)
      .resize(1200, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(optimizedPath)
    
    // Delete original file after processing
    fs.unlinkSync(filePath)
    
    return optimizedPath
  } catch (error) {
    console.error('Error optimizing bank slip image:', error)
    throw new Error('Failed to optimize bank slip image')
  }
}

// Utility function to get file URL
export const getFileUrl = (filename: string, type: 'profile-picture' | 'bank-slip' | 'document' = 'document'): string => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/uploads/${type}s/${filename}`
}

// Utility function to delete file
export const deleteFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}

// Error handler for multer
export const handleMulterError = (error: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return 'File too large'
      case 'LIMIT_FILE_COUNT':
        return 'Too many files'
      case 'LIMIT_UNEXPECTED_FILE':
        return 'Unexpected field name'
      default:
        return 'File upload error'
    }
  }
  return error.message || 'Unknown upload error'
}

// Export constants for use in other modules
export const MULTER_CONFIG = {
  UPLOAD_DIRS,
  FILE_SIZE_LIMITS,
  ALLOWED_MIME_TYPES
} as const 