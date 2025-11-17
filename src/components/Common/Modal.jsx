import React, { useEffect, useRef } from 'react';

const Modal = ({ title, children, onClose, size = 'medium', showHeader = true }) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Focus management / focus trap
  const modalRef = useRef(null);
  useEffect(() => {
    const node = modalRef.current;
    if (!node) return;

    // focus the modal for screen readers
    node.focus();

    const focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(node.querySelectorAll(focusableSelectors));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, []);

  const getModalSizeClass = () => {
    switch (size) {
      case 'small': return 'modal-small';
      case 'large': return 'modal-large';
      case 'extra-large': return 'modal-xl';
      default: return 'modal-medium';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal ${getModalSizeClass()}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={modalRef}
      >
        {showHeader && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button 
              onClick={onClose}
              className="close-btn"
              type="button"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
          animation: fadeIn 0.3s ease-out;
        }

        .modal {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-height: 90vh;
          overflow-y: auto;
          animation: slideIn 0.3s ease-out;
          border: 1px solid #e0e0e0;
        }

        .modal-small {
          width: 90%;
          max-width: 400px;
        }

        .modal-medium {
          width: 90%;
          max-width: 600px;
        }

        .modal-large {
          width: 90%;
          max-width: 800px;
        }

        .modal-xl {
          width: 95%;
          max-width: 1200px;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 30px;
          border-bottom: 1px solid #eee;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px 12px 0 0;
          color: white;
        }

        .modal-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: white;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: white;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .modal-body {
          padding: 30px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .modal {
            width: 95%;
            margin: 20px;
            max-height: 85vh;
          }

          .modal-header {
            padding: 15px 20px;
          }

          .modal-body {
            padding: 20px;
          }

          .modal-title {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;
