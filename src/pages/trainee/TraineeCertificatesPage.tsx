import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Certificate } from '../../types';
import { CertificateModal } from '../../components/common/CertificateModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Award, ShieldCheck, Download, Share2, ExternalLink, Calendar, BookOpen, User } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface TraineeCertificatesPageProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const TraineeCertificatesPage: React.FC<TraineeCertificatesPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?._id || 'usr-trainee-1';

  // Include user certificates or fallback to demo certificate if any
  const certificates = storageService.getCertificates().filter((c) => c.traineeId === userId || c.traineeId === 'usr-trainee-1' || c.traineeId === 'u-trainee-1');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const handleShare = (cert: Certificate) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Verified Certificate ID ${cert.certificateId} for ${cert.courseTitle} awarded to ${cert.traineeName} on Capacity Connect.`
      );
      showToast('Certificate verification link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            Accredited Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Verified Digital Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tamper-evident completion certificates with official accreditation IDs and high-resolution PDF download.
          </p>
        </div>

        <button
          onClick={() => onNavigate('verify-certificate')}
          className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-colors w-fit cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Public Verification Engine</span>
        </button>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Certificates Earned Yet"
          description="Complete your enrolled course modules and score 70% or higher on final MCQ competency assessments to generate certified credentials."
          actionLabel="Explore Course Catalog"
          onAction={() => onNavigate('courses-explore')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white dark:bg-[#151B28] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-xl border border-purple-200 dark:border-purple-800">
                    {cert.certificateId}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VALID</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                  {cert.courseTitle}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Awarded To:</span>
                    <strong className="text-slate-900 dark:text-white">{cert.traineeName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Assessment Score:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-black">{cert.score}% (PASSED)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Lead Trainer:</span>
                    <strong className="text-slate-900 dark:text-white">{cert.trainerName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Date Issued:</span>
                    <strong className="text-slate-900 dark:text-white">{cert.issueDate}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleShare(cert)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Share Verification Text"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('verify-certificate', { certificateId: cert.certificateId })}
                    className="p-2 rounded-xl text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer"
                    title="Open in Public Verification Engine"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedCert(cert)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>View / Save PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
          onNavigate={onNavigate}
        />
      )}

    </div>
  );
};
