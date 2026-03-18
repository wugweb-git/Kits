import React from 'react';
import { Upload, X, File } from 'lucide-react';
import { Button } from './Button';

export interface FileInputProps {
  value?: File | File[] | null;
  onChange: (files: File | File[] | null) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * FileInput Component
 * 
 * File upload input with drag-and-drop support.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <FileInput
 *   value={file}
 *   onChange={setFile}
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024} // 5MB
 * />
 */
export function FileInput({
  value,
  onChange,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  placeholder = 'Choose file or drag and drop',
  className = '',
  style = {},
}: FileInputProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const files = Array.isArray(value) ? value : value ? [value] : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (selectedFiles: File[]) => {
    // Filter by max size if specified
    const validFiles = maxSize
      ? selectedFiles.filter((file) => file.size <= maxSize)
      : selectedFiles;

    if (validFiles.length > 0) {
      onChange(multiple ? validFiles : validFiles[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!disabled) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    if (multiple && Array.isArray(value)) {
      const newFiles = value.filter((_, i) => i !== index);
      onChange(newFiles.length > 0 ? newFiles : null);
    } else {
      onChange(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={className}
      style={{
        width: '100%',
        ...style,
      }}
    >
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-8)',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: isDragging
            ? 'var(--accent-subtle)'
            : 'var(--input-background)',
          transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Upload
          size={40}
          style={{
            color: isDragging ? 'var(--accent)' : 'var(--muted-foreground)',
            marginBottom: 'var(--spacing-3)',
          }}
        />
        <p
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--foreground)',
            margin: 0,
            marginBottom: 'var(--spacing-1)',
          }}
        >
          {placeholder}
        </p>
        <p
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
            margin: 0,
          }}
        >
          {maxSize
            ? `Maximum file size: ${formatFileSize(maxSize)}`
            : 'Any file size'}
        </p>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div
          style={{
            marginTop: 'var(--spacing-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-2)',
          }}
        >
          {files.map((file, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-3)',
                padding: 'var(--spacing-3)',
                background: 'var(--muted)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            >
              <File size={20} style={{ color: 'var(--muted-foreground)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {file.name}
                </p>
                <p
                  style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--muted-foreground)',
                    margin: 0,
                  }}
                >
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                disabled={disabled}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  color: 'var(--muted-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                }}
                onMouseEnter={(e) => {
                  if (!disabled) {
                    e.currentTarget.style.color = 'var(--destructive)';
                    e.currentTarget.style.background = 'var(--destructive-subtle)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                  e.currentTarget.style.background = 'none';
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
