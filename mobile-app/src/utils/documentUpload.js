/**
 * Document Upload Utility for React Native
 * Handles cross-platform file uploads using native APIs
 * Supports: Camera capture, Photo library selection, Document picker
 */

import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Validate file size and type for React Native
 * @param {Object} file - File object from image/document picker
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateDocumentFile = (file) => {
  if (!file) {
    return 'Please choose a document file.';
  }

  if (file.size && file.size > MAX_FILE_SIZE_BYTES) {
    return 'Please choose a file smaller than 10 MB.';
  }

  const fileName = file.name || file.filename || '';
  const extension = fileName.toLowerCase();
  const hasValidExtension = ACCEPTED_EXTENSIONS.some(ext => extension.endsWith(`.${ext}`));
  const mimeType = file.mimeType || file.type || '';
  const hasValidMimeType = ['image/jpeg', 'image/png', 'application/pdf'].includes(mimeType);

  if (!hasValidExtension && !hasValidMimeType) {
    return 'Only JPG, JPEG, PNG, and PDF files are allowed.';
  }

  return null;
};

/**
 * Open device camera to capture a photo
 * Uses expo-image-picker CameraModule
 * @param {Function} onSuccess - Callback function that receives the file object
 * @param {Function} onError - Callback function for errors
 */
export const openCamera = async (onSuccess, onError) => {
  try {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      onError?.('Camera permission denied. Please enable camera access in settings.');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const file = {
        name: asset.filename || `photo_${Date.now()}.jpg`,
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        size: asset.fileSize || null,
        mimeType: asset.type || 'image/jpeg',
      };

      const validationError = validateDocumentFile(file);
      if (validationError) {
        onError?.(validationError);
        return;
      }

      onSuccess?.(file);
    }
  } catch (error) {
    onError?.(error.message || 'Failed to capture photo');
  }
};

/**
 * Open device photo gallery to select an image
 * Uses expo-image-picker
 * @param {Function} onSuccess - Callback function that receives the file object
 * @param {Function} onError - Callback function for errors
 */
export const openPhotoGallery = async (onSuccess, onError) => {
  try {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      onError?.('Photo library permission denied. Please enable photo access in settings.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const file = {
        name: asset.filename || `photo_${Date.now()}.jpg`,
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        size: asset.fileSize || null,
        mimeType: asset.type || 'image/jpeg',
      };

      const validationError = validateDocumentFile(file);
      if (validationError) {
        onError?.(validationError);
        return;
      }

      onSuccess?.(file);
    }
  } catch (error) {
    onError?.(error.message || 'Failed to select photo');
  }
};

/**
 * Open system file picker for documents
 * Uses expo-document-picker
 * @param {Function} onSuccess - Callback function that receives the file object
 * @param {Function} onError - Callback function for errors
 */
export const openFilePicker = async (onSuccess, onError) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/jpeg', 'image/png', 'application/pdf', '.jpg', '.jpeg', '.png', '.pdf'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const file = {
        name: asset.name || `document_${Date.now()}.pdf`,
        uri: asset.uri,
        type: asset.mimeType || 'application/pdf',
        size: asset.size || null,
        mimeType: asset.mimeType || 'application/pdf',
      };

      const validationError = validateDocumentFile(file);
      if (validationError) {
        onError?.(validationError);
        return;
      }

      onSuccess?.(file);
    }
  } catch (error) {
    onError?.(error.message || 'Failed to select document');
  }
};

/**
 * Handle file selection from any source
 * Validates and processes the file
 * @param {Object} file - File object from picker
 * @param {Function} onSuccess - Callback for successful validation
 * @param {Function} onError - Callback for validation errors
 */
export const processDocumentFile = (file, onSuccess, onError) => {
  const validationError = validateDocumentFile(file);

  if (validationError) {
    onError?.(validationError);
    return;
  }

  onSuccess?.(file);
};

/**
 * Get file icon based on type
 * @param {Object} file - File object
 * @returns {string} - Icon emoji or character
 */
export const getFileIcon = (file) => {
  if (!file) return '📄';

  const mimeType = file.mimeType || file.type || '';
  const fileName = file.name || file.filename || '';

  if (mimeType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png)$/i)) {
    return '🖼️';
  }

  if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return '📄';
  }

  return '📋';
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Convert React Native file to FormData for upload
 * @param {Object} file - File object from picker
 * @param {string} documentType - Type of document being uploaded
 * @returns {FormData} - FormData object ready for upload
 */
export const createFormDataForUpload = (file, documentType) => {
  const formData = new FormData();
  
  formData.append('document_type', documentType);
  formData.append('document_file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || file.type || 'application/octet-stream',
  });

  return formData;
};
