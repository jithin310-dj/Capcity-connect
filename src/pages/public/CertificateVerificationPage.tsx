import React, { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificateService';
import { Certificate } from '../../types';
import { CertificateModal } from '../../components/common/CertificateModal';
import { ShieldCheck, Search, Award, CheckCircle2, AlertCircle, Calendar, User, BookOpen, ExternalLink, ArrowLeft } from 'lucide-react';

interface CertificateVerificationPageProps {
  initialCertId?: string;
  onNavigate?: (view: string, payload?: any) => void;
}

export const CertificateVerificationPage: React.FC<CertificateVerificationPageProps> = ({ initialCertId, onNavigate }) => {
  const [certId, setCertId] = useState(initialCertId || 'CC-2026-10045');
  const [searchedCert, setSearchedCert] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCertForModal, setSelectedCertForModal] = useState<Certificate | null>(null);

  useEffect(() => {
    if (initialCertId) {
      handleSearch(initialCertId);
    }
  }, [initialCertId]);

  const handleSearch = (idToSearch?: string) => {
    const id = (idToSearch || certId).trim();
    if (!id) return;
    setHasSearched(true);
    const found = certificateService.verifyCertificate(id);
    setSearchedCert(found.valid && found.certificate ? found.certificate : null);
  };

  const sampleCertIds = ['CC-2026-10045', 'CC-2026-10046', 'CC-2026-10047', 'CC-2026-10048'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Top Back Navigation if onNavigate is available */}
      {onNavigate && (
        <button
          onClick={() => onNavigate('landing')}
          className="mb-6 px-3.5 py-1.5 rounded-xl bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Back to Navigation</span>
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Public Certificate Verification Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
          Verify authentic digital credentials issued by the CAPACITY CONNECT Learning Management System.
        </p>
      </div>

      {/* Verification Search Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 mb-8">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Enter Certificate Unique ID
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g. CC-2026-10045"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono uppercase focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Credential</span>
          </button>
        </div>

        {/* Quick Sample Links */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold">Quick Demo IDs:</span>
          {sampleCertIds.map((id) => (
            <button
              key={id}
              onClick={() => {
                setCertId(id);
                handleSearch(id);
              }}
              className="font-mono px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Search Result */}
      {hasSearched && (
        <div>
          {searchedCert ? (
            <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200 pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900 text-xs font-black uppercase tracking-wider mb-1">
                      VALID & AUTHENTIC CREDENTIAL
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 font-mono">
                      {searchedCert.certificateId}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCertForModal(searchedCert)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors w-fit"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>View Official Certificate</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500 block text-xs mb-1">Recipient Name</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5 text-base">
                    <User className="w-4 h-4 text-emerald-700" />
                    {searchedCert.traineeName}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block text-xs mb-1">Course Title</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5 text-base">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    {searchedCert.courseTitle}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block text-xs mb-1">Date of Issue</span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5 text-base">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    {searchedCert.issueDate}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block text-xs mb-1">Assessment Performance</span>
                  <p className="font-extrabold text-emerald-700 text-base">
                    {searchedCert.score}% (PASSED)
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block text-xs mb-1">Authorized Trainer</span>
                  <p className="font-bold text-slate-900 text-base">
                    {searchedCert.trainerName}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block text-xs mb-1">Verification Hash</span>
                  <p className="font-mono text-[11px] text-slate-600 break-all bg-white/80 p-1.5 rounded-md border border-emerald-200">
                    {searchedCert.verificationUrl}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8 text-center text-rose-900">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold">Credential Not Found</h3>
              <p className="text-xs text-rose-700 max-w-md mx-auto mt-1">
                No verified certificate was found matching ID "<span className="font-mono font-bold">{certId}</span>". Please double-check the ID or verify with the issuing organization.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertForModal && (
        <CertificateModal
          certificate={selectedCertForModal}
          onClose={() => setSelectedCertForModal(null)}
          onNavigate={onNavigate}
        />
      )}

    </div>
  );
};
