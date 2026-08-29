import React, { useState, useEffect, useRef } from 'react';
import { Certificate } from '../../types';
import { Award, Printer, Download, Share2, CheckCircle2, ShieldCheck, X, QrCode, ArrowLeft, ExternalLink, Loader2, FileCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { pdfService } from '../../services/pdfService';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
  onNavigate?: (view: string, payload?: any) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose, onNavigate }) => {
  const { showToast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    const certElement = certificateRef.current || document.getElementById('printable-certificate');
    if (!certElement) {
      showToast('Certificate template could not be loaded for PDF export.', 'error');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      showToast('Generating official accredited PDF certificate...', 'info');

      const result = await pdfService.generateCertificatePDF(certElement, certificate, {
        scale: 2.5,
        quality: 1.0
      });

      if (result.success) {
        showToast(`Certificate saved successfully as ${result.fileName}!`, 'success');
      } else {
        showToast(result.error || 'PDF generation failed. Please try again.', 'error');
      }
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      showToast('Error generating PDF certificate. Please try again.', 'error');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Verified Capacity Building Certificate ${certificate.certificateId} for "${certificate.courseTitle}" awarded to ${certificate.traineeName}. Verify credential at: https://capacityconnect.gov.in/verify?id=${certificate.certificateId}`
      );
      showToast('Certificate verification link copied to clipboard!', 'success');
    }
  };

  const handleVerify = () => {
    if (onNavigate) {
      onClose();
      onNavigate('verify-certificate', { certificateId: certificate.certificateId });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Modal Top Action Bar with Back button & Download Actions */}
        <div className="px-4 py-3 bg-[#0F172A] border-b border-slate-800 text-slate-300 flex items-center justify-between no-print gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold flex items-center gap-2 border border-slate-700 transition-all shadow-xs group cursor-pointer"
              title="Return to previous view"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
            
            <div className="hidden sm:flex items-center gap-2 font-mono">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold tracking-wide text-white">
                CREDENTIAL ID: {certificate.certificateId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              title="Save directly as PDF document"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>SAVE AS PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700 shadow-xs transition-colors cursor-pointer"
              title="Print Certificate via Browser"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PRINT</span>
            </button>

            <button
              onClick={handleShare}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Copy verification link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">COPY LINK</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Design */}
        <div id="printable-certificate" ref={certificateRef} className="p-4 sm:p-10 bg-white text-slate-900 certificate-printable-canvas">
          <div className="relative border-4 sm:border-8 border-double border-slate-800 p-6 sm:p-12 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/30 text-center rounded-2xl shadow-inner">
            
            {/* Corner Decorative Elements */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 sm:w-10 sm:h-10 border-t-2 border-l-2 border-amber-600"></div>
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 border-t-2 border-r-2 border-amber-600"></div>
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-8 h-8 sm:w-10 sm:h-10 border-b-2 border-l-2 border-amber-600"></div>
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 border-b-2 border-r-2 border-amber-600"></div>

            {/* Header / Seal */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-900 via-indigo-900 to-amber-600 text-white flex items-center justify-center shadow-lg border-2 border-amber-300 mb-2 sm:mb-3">
                <Award className="w-8 h-8 sm:w-9 sm:h-9 text-amber-300" />
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-widest uppercase">
                CAPACITY CONNECT
              </h1>
              <p className="text-[10px] sm:text-[11px] font-bold text-amber-700 tracking-widest uppercase mt-0.5">
                Digital Capacity Building & Learning Management Portal
              </p>
              <div className="w-28 sm:w-36 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent my-2 sm:my-3"></div>
            </div>

            {/* Title */}
            <div className="mb-6 sm:mb-8">
              <h2 className="font-certificate text-xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-wide uppercase">
                CERTIFICATE OF COMPLETION
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 italic mt-1">
                This is to officially certify that
              </p>
            </div>

            {/* Trainee Name */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-certificate text-xl sm:text-3xl lg:text-4xl font-extrabold text-blue-900 tracking-normal border-b-2 border-slate-300 pb-2 inline-block px-4 sm:px-8">
                {certificate.traineeName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-xl mx-auto leading-relaxed">
                has successfully completed all required training modules and demonstrated proven mastery by passing the final competency assessment for the course:
              </p>
            </div>

            {/* Course Title */}
            <div className="mb-8 sm:mb-10">
              <h4 className="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 bg-slate-100/80 py-2 sm:py-2.5 px-4 sm:px-6 rounded-xl inline-block border border-slate-200">
                {certificate.courseTitle}
              </h4>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-3 text-xs font-semibold text-slate-600">
                <span>Assessment Score: <strong className="text-emerald-700 font-bold">{certificate.score}% (PASSED)</strong></span>
                <span className="hidden sm:inline">•</span>
                <span>Date Issued: <strong>{certificate.issueDate}</strong></span>
              </div>
            </div>

            {/* Signatures & QR Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 items-end pt-6 sm:pt-8 border-t border-slate-200 text-xs mt-4 sm:mt-6">
              
              {/* Trainer Sign */}
              <div className="text-center order-2 sm:order-1">
                <div className="h-9 flex items-center justify-center italic text-indigo-900 font-serif text-base border-b border-slate-400 pb-1 mx-4">
                  {certificate.trainerName}
                </div>
                <p className="font-bold text-slate-800 mt-1">{certificate.trainerName}</p>
                <p className="text-[10px] text-slate-500">Lead Domain Trainer</p>
              </div>

              {/* Verified Seal & QR */}
              <div className="flex flex-col items-center justify-center order-1 sm:order-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 p-1.5 rounded-xl border border-slate-300 bg-white shadow-2xs mb-1 flex items-center justify-center">
                  <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-slate-800" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>VERIFIED AUTHENTIC</span>
                </div>
                <p className="font-mono text-[10px] text-slate-500 mt-0.5">ID: {certificate.certificateId}</p>
              </div>

              {/* Admin Sign */}
              <div className="text-center order-3">
                <div className="h-9 flex items-center justify-center italic text-blue-900 font-serif text-base border-b border-slate-400 pb-1 mx-4">
                  Rajeshwar Sharma
                </div>
                <p className="font-bold text-slate-800 mt-1">Chief Learning Officer</p>
                <p className="text-[10px] text-slate-500">Capacity Connect Authority</p>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Action Footer with Back Button */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-mono font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Close & Return</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2.5">
            {onNavigate && (
              <button
                onClick={handleVerify}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-mono font-semibold text-xs rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Verify Online</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Save as PDF Document</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
