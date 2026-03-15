/**
 * Safely copy text to clipboard with error handling
 * Returns true if successful, false otherwise
 * 
 * NOTE: In environments where Clipboard API is blocked by permissions policy,
 * we use the fallback method exclusively to avoid errors.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Always use fallback method due to Clipboard API being blocked in this environment
  // This prevents "NotAllowedError: Failed to execute 'writeText' on 'Clipboard'"
  return fallbackCopyToClipboard(text);
}

/**
 * Fallback method using execCommand (deprecated but widely supported)
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible and non-interactive
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    // Select the text
    textArea.focus();
    textArea.select();
    
    // For iOS devices
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, text.length);
    }
    
    // Execute the copy command
    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (err) {
      console.error('execCommand copy failed:', err);
    }
    
    // Clean up
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    return false;
  }
}