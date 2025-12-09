/**
 * QuickReport - Main JavaScript
 * Production-Grade Component-Based JS
 */

// ========== Utility Functions ==========

/**
 * Show loading spinner
 */
function showLoader(containerId = 'loader') {
    const loader = document.getElementById(containerId);
    if (loader) {
        loader.style.display = 'flex';
    }
}

/**
 * Hide loading spinner
 */
function hideLoader(containerId = 'loader') {
    const loader = document.getElementById(containerId);
    if (loader) {
        loader.style.display = 'none';
    }
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = document.getElementById('alert-container') || document.body;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span class="alert-icon">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        </span>
        <span class="alert-message">${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    alertContainer.appendChild(alert);
    
    if (duration > 0) {
        setTimeout(() => {
            alert.remove();
        }, duration);
    }
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = '$') {
    return `${currency}${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format percentage
 */
function formatPercentage(value) {
    const num = parseFloat(value);
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
}

/**
 * Validate email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate file type
 */
function validateFileType(file, allowedTypes = ['json', 'csv']) {
    const extension = file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(extension);
}

/**
 * Validate file size (in MB)
 */
function validateFileSize(file, maxSizeMB = 10) {
    const maxSize = maxSizeMB * 1024 * 1024;
    return file.size <= maxSize;
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== Form Validation ==========

/**
 * Initialize form validation
 */
function initFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add('was-validated');
    });
}

// ========== File Upload Helpers ==========

/**
 * Handle file upload with validation
 */
function handleFileUpload(inputId, callback) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!validateFileType(file)) {
            showAlert('Invalid file type. Please upload JSON or CSV files only.', 'error');
            input.value = '';
            return;
        }
        
        // Validate file size
        if (!validateFileSize(file)) {
            showAlert('File size exceeds 10MB limit.', 'error');
            input.value = '';
            return;
        }
        
        if (callback) {
            callback(file);
        }
    });
}

// ========== API Helpers ==========

/**
 * Make API request
 */
async function apiRequest(url, options = {}) {
    try {
        showLoader();
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        const data = await response.json();
        hideLoader();
        return data;
    } catch (error) {
        hideLoader();
        showAlert('Network error. Please try again.', 'error');
        throw error;
    }
}

// ========== Initialize on DOM Load ==========

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all forms with validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.id) {
            initFormValidation(form.id);
        }
    });
    
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});

// ========== Export for use in other scripts ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showLoader,
        hideLoader,
        showAlert,
        formatCurrency,
        formatPercentage,
        validateEmail,
        validateFileType,
        validateFileSize,
        apiRequest
    };
}

