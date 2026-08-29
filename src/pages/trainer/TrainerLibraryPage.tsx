import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { materialService } from '../../services/materialService';
import { useToast } from '../../context/ToastContext';
import { TrainingMaterial } from '../../types';
import { 
  FolderGit2, Plus, Trash2, Download, Video, 
  Presentation, FileText, Search, Filter, Sparkles, ExternalLink,
  BookOpen, Layers, CheckCircle2, User, Eye
} from 'lucide-react';

interface TrainerLibraryPageProps {
  onNavigate?: (view: string, payload?: any) => void;
}

export const TrainerLibraryPage: React.FC<TrainerLibraryPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const currentTrainerId = user?._id || 'usr-trainer-1';

  const [allMaterials, setAllMaterials] = useState<TrainingMaterial[]>(() => storageService.getMaterials());
  const [viewScope, setViewScope] = useState<'all' | 'my'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // New material modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<'video' | 'presentation' | 'pdf' | 'document'>('video');
  const [newCategory, setNewCategory] = useState('Data Science & AI');
  const [newTags, setNewTags] = useState('Machine Learning, Python');
  const [newSize, setNewSize] = useState('45 MB');
  const [newFileUrl, setNewFileUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

  const refreshMaterials = () => {
    setAllMaterials(storageService.getMaterials());
  };

  const filteredMaterials = allMaterials.filter((m) => {
    // Scope filter
    if (viewScope === 'my' && m.trainerId !== currentTrainerId && m.trainerId !== 'usr-trainer-1' && m.trainerId !== 'u-trainer-1') {
      return false;
    }

    const type = m.type || m.fileType || 'pdf';
    const matchesType = selectedType === 'All' || type === selectedType;

    const tags = m.tags || [];
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesType;

    const matchesSearch =
      m.title.toLowerCase().includes(query) ||
      (m.description && m.description.toLowerCase().includes(query)) ||
      (m.courseTitle && m.courseTitle.toLowerCase().includes(query)) ||
      (m.subject && m.subject.toLowerCase().includes(query)) ||
      (m.trainerName && m.trainerName.toLowerCase().includes(query)) ||
      tags.some((t) => t.toLowerCase().includes(query));

    return matchesSearch && matchesType;
  });

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter an asset title', 'warning');
      return;
    }

    const tags = newTags.split(',').map((t) => t.trim()).filter(Boolean);

    materialService.uploadMaterial({
      title: newTitle,
      description: newDescription || 'Institutional learning asset deposited by faculty.',
      type: newType,
      fileType: newType,
      fileUrl: newFileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileSize: newSize || '12.4 MB',
      duration: newType === 'video' ? '45 mins' : undefined,
      category: newCategory,
      subject: newCategory,
      trainerId: user?._id || 'usr-trainer-1',
      trainerName: user?.name || 'Faculty Trainer',
      tags: tags.length > 0 ? tags : [newCategory, newType.toUpperCase()]
    });

    refreshMaterials();
    setShowUploadModal(false);
    setNewTitle('');
    setNewDescription('');
    showToast('New asset deposited into Centralized Trainer Library!', 'success');
  };

  const handleDelete = (id: string, title: string) => {
    materialService.deleteMaterial(id);
    refreshMaterials();
    showToast(`Removed "${title}" from repository`, 'info');
  };

  const handleDownload = (mat: TrainingMaterial) => {
    showToast(`Downloading "${mat.title}" (${mat.fileSize || 'Standard file'})`, 'success');
    if (mat.fileUrl && mat.fileUrl !== '#') {
      window.open(mat.fileUrl, '_blank');
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'presentation':
        return <Presentation className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            Institutional Resource Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Centralized Trainer Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Deposit, share, and reuse vetted lecture recordings, syllabus slide decks, reference datasets, and curriculum guides across the faculty network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>DEPOSIT ASSET</span>
          </button>
        </div>
      </div>

      {/* Scope Selector Tabs & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">TOTAL ASSETS IN REPO</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{allMaterials.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Multi-format educational materials</div>
        </div>

        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">MY UPLOADED ASSETS</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">
            {allMaterials.filter((m) => m.trainerId === currentTrainerId || m.trainerId === 'usr-trainer-1' || m.trainerId === 'u-trainer-1').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Authored by active session</div>
        </div>

        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">INSTITUTIONAL DOWNLOADS</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {allMaterials.reduce((acc, m) => acc + (m.downloadsCount || (m as any).downloads || 150), 0)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Learner & faculty accesses</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col md:flex-row gap-3">
        {/* Scope Pill Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewScope('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              viewScope === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Institutional Hub ({allMaterials.length})
          </button>
          <button
            onClick={() => setViewScope('my')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              viewScope === 'my'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Assets Only
          </button>
        </div>

        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search library by title, subject, faculty name, or skill tags..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="All">All Formats</option>
            <option value="video">Video Recordings</option>
            <option value="presentation">Slide Decks</option>
            <option value="pdf">PDF Documents</option>
            <option value="document">Curriculum Guides</option>
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-2xs">
          <FolderGit2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Learning Materials Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery ? `No assets matching "${searchQuery}". Try changing your filters.` : 'No materials deposited yet in this view.'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedType('All'); setViewScope('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold hover:bg-slate-200 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredMaterials.map((mat) => {
            const formatType = mat.type || mat.fileType || 'pdf';
            const downloads = mat.downloadsCount ?? (mat as any).downloads ?? 128;
            const isOwner = mat.trainerId === currentTrainerId || mat.trainerId === 'usr-trainer-1' || mat.trainerId === 'u-trainer-1';

            return (
              <div
                key={mat._id}
                className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                      {getTypeIcon(formatType)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {formatType} • {mat.fileSize || '3.2 MB'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                    {mat.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
                    {mat.description || mat.courseTitle || 'Vetted institutional curriculum asset.'}
                  </p>

                  <div className="flex items-center gap-2 mb-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{mat.trainerName || 'Faculty Lead'}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(mat.tags && mat.tags.length > 0 ? mat.tags : [mat.subject || 'Data Science', 'Syllabus']).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-mono font-medium border border-amber-500/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {downloads} downloads
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownload(mat)}
                      className="px-2.5 py-1.5 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Download / View Asset"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ACCESS</span>
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(mat._id, mat.title)}
                        className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete from Repository"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <FolderGit2 className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Deposit Material to Hub</h3>
            </div>

            <form onSubmit={handleCreateMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Executive Summary on DPDP Compliance 2026"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief synopsis of pedagogical value..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Format Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="video">Video Recording</option>
                    <option value="presentation">Presentation Deck</option>
                    <option value="pdf">PDF Publication</option>
                    <option value="document">Curriculum Document</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">File Size</label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Subject / Domain Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Data Science & AI"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Machine Learning, Python, Compliance"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Deposit Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
