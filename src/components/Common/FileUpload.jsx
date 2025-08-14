import React, { useState, useRef } from 'react';

const FileUpload = ({ 
  onFileSelect, 
  acceptedTypes = '.pdf,.doc,.docx,.jpg,.png,.jpeg', 
  maxSize = 5, // MB
  multiple = false,
  label = 'Upload Files'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => validateFile(file));
    
    if (validFiles.length > 0) {
      setUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const newFiles = validFiles.map(file => ({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          uploadDate: new Date()
        }));
        
        setUploadedFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
        setUploading(false);
        onFileSelect && onFileSelect(multiple ? newFiles : newFiles[0]);
      }, 1500);
    }
  };

  const validateFile = (file) => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    const validTypes = acceptedTypes.split(',').map(type => type.trim());
    
    if (file.size > maxSizeBytes) {
      alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
      return false;
    }
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!validTypes.includes(fileExtension)) {
      alert(`File type ${fileExtension} is not supported.`);
      return false;
    }
    
    return true;
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      case 'xls':
      case 'xlsx': return '📊';
      default: return '📁';
    }
  };

  return (
    <div className="file-upload-container">
      <div 
        className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          {uploading ? (
            <>
              <div className="upload-spinner"></div>
              <p>Uploading files...</p>
            </>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <h4>{label}</h4>
              <p>Drag and drop files here, or click to browse</p>
              <div className="file-info">
                <span>Supported: {acceptedTypes}</span>
                <span>Max size: {maxSize}MB {multiple ? '• Multiple files allowed' : ''}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files ({uploadedFiles.length})</h4>
          <div className="file-list">
            {uploadedFiles.map(file => (
              <div key={file.id} className="file-item">
                <div className="file-info-row">
                  <span className="file-icon">{getFileIcon(file.name)}</span>
                  <div className="file-details">
                    <div className="file-name">{file.name}</div>
                    <div className="file-meta">
                      {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="file-actions">
                    <button 
                      className="btn-icon download"
                      onClick={() => window.open(file.url, '_blank')}
                      title="View/Download"
                    >
                      📥
                    </button>
                    <button 
                      className="btn-icon remove"
                      onClick={() => removeFile(file.id)}
                      title="Remove"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .file-upload-container {
          width: 100%;
        }

        .file-upload-area {
          border: 2px dashed #ccc;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .file-upload-area:hover {
          border-color: #667eea;
          background: #f0f8ff;
        }

        .file-upload-area.drag-active {
          border-color: #667eea;
          background: #e6f3ff;
          transform: scale(1.02);
        }

        .file-upload-area.uploading {
          border-color: #28a745;
          background: #f0fff4;
          cursor: not-allowed;
        }

        .upload-content {
          pointer-events: none;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.7;
        }

        .upload-content h4 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 18px;
        }

        .upload-content p {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
        }

        .file-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #999;
        }

        .upload-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .uploaded-files {
          margin-top: 24px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          border: 1px solid #eee;
        }

        .uploaded-files h4 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 16px;
        }

        .file-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .file-item {
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 8px;
          background: #fafafa;
          transition: all 0.2s ease;
        }

        .file-item:hover {
          background: #f0f0f0;
          border-color: #ddd;
        }

        .file-info-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .file-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .file-details {
          flex: 1;
          min-width: 0;
        }

        .file-name {
          font-weight: 500;
          color: #333;
          font-size: 14px;
          word-break: break-word;
        }

        .file-meta {
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }

        .file-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .btn-icon:hover {
          background: #e0e0e0;
          transform: scale(1.1);
        }

        .btn-icon.remove:hover {
          background: #ffe6e6;
        }

        .btn-icon.download:hover {
          background: #e6f3ff;
        }

        @media (max-width: 768px) {
          .file-upload-area {
            padding: 30px 15px;
          }

          .upload-icon {
            font-size: 36px;
            margin-bottom: 12px;
          }

          .upload-content h4 {
            font-size: 16px;
          }

          .file-info {
            font-size: 11px;
          }

          .file-info-row {
            gap: 8px;
          }

          .file-name {
            font-size: 13px;
          }

          .file-meta {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default FileUpload;
