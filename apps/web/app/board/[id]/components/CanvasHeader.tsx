import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Lock, Download, CheckCircle2, ChevronDown, Share2, Copy, Check } from 'lucide-react';
import { generateInviteToken } from '../../../actions/board';
import { BoardMember } from '../WhiteboardWrapper';
import { getOptimizedAvatarUrl } from '../../../../lib/utils';

interface Collaborator {
  clientId: number;
  user?: {
    id?: string;
    name?: string;
    color?: string;
    avatar?: string;
  };
}

interface CanvasHeaderProps {
  board: {
    id: string;
    name: string;
    isPublic: boolean;
    inviteToken: string | null;
  };
  currentUser: {
    id: string;
    name: string;
    image: string | null;
    role: string;
  };
  members: BoardMember[];
  collaborators: Collaborator[];
  isConnected: boolean;
  handleExport: (format: 'png' | 'pdf') => void;
}

export default function CanvasHeader({
  board,
  currentUser,
  members,
  collaborators,
  isConnected,
  handleExport,
}: CanvasHeaderProps) {
  const role = currentUser.role;
  const router = useRouter();
  const [showExport, setShowExport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(board.inviteToken || null);

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/board/${board.id}?invite=${inviteToken}`;
  };

  const handleCopy = () => {
    if (!inviteToken) return;
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const res = await generateInviteToken(board.id);
    if (res.success && res.token) {
      setInviteToken(res.token);
    } else {
      alert(res.error || 'Failed to generate link');
    }
    setIsGenerating(false);
  };

  return (
    <header className="glass" style={styles.header}>
      <div style={styles.headerLeft}>
        <button onClick={() => router.push('/dashboard')} style={styles.btnBack}>
          <ArrowLeft size={18} />
        </button>
        <div style={styles.boardInfo}>
          <span style={styles.boardName}>{board.name}</span>
        </div>
      </div>

      <div style={styles.headerRight}>
        <div style={styles.collaboratorStack}>
          {members.map((member, i) => {
            const isSelf = member.id === currentUser.id;
            
            // Check if this member is currently online/active in the Yjs room
            const activeCollab = collaborators.find(c => c.user?.id === member.id);
            const isOnline = isSelf || !!activeCollab;
            
            // Get avatar color: if online, use Yjs color or default accent, if offline use grey
            const avatarColor = isSelf 
              ? 'var(--color-accent-primary)' 
              : (activeCollab?.user?.color || '#10b981');
              
            const displayName = isSelf 
              ? `${currentUser.name} (You)` 
              : `${member.name} (${isOnline ? 'Active' : 'Offline'})`;

            return (
              <div 
                key={member.id} 
                title={displayName}
                style={{ 
                  ...styles.avatar, 
                  backgroundColor: isSelf ? 'var(--color-accent-primary)' : '#374151',
                  marginLeft: i > 0 ? '-10px' : '0',
                  opacity: isOnline ? 1 : 0.45,
                  border: '2px solid var(--color-bg-primary)',
                  boxShadow: isOnline 
                    ? `0 0 0 2px ${avatarColor}` 
                    : 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: isOnline ? 10 : 1,
                }}
              >
                {member.avatarUrl
                  ? <img src={getOptimizedAvatarUrl(member.avatarUrl, 64)} alt="" style={styles.avatarImg} />
                  : (member.name?.[0] || '?')}
                  
                {/* Active/Green Dot highlight indicator */}
                {isOnline && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-success)',
                    border: '1px solid var(--color-bg-primary)',
                  }} />
                )}
              </div>
            );
          })}
        </div>


        
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowExport(!showExport)} style={styles.btnAction} title="Export Options">
            <span style={styles.exportText}>Download</span>
            <ChevronDown size={14} />
          </button>
          
          {showExport && (
            <div style={styles.exportDropdown}>
              <button 
                onClick={() => { handleExport('png'); setShowExport(false); }} 
                style={styles.dropdownItem}
              >
                Export as PNG
              </button>
              <button 
                onClick={() => { handleExport('pdf'); setShowExport(false); }} 
                style={styles.dropdownItem}
              >
                Export as PDF
              </button>
            </div>
          )}
        </div>

        {/* Share Button & Popover */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setShowShare(!showShare);
              setShowExport(false);
            }} 
            style={styles.btnAction} 
            title="Share Board"
          >
            <Share2 size={14} />
            <span style={styles.exportText}>Share</span>
          </button>

          {showShare && (
            <div style={styles.sharePopover}>
              <div style={styles.popoverHeader}>
                <span style={styles.popoverTitle}>Share whiteboard</span>
              </div>
              
              <div style={styles.popoverContent}>
                {inviteToken ? (
                  <div style={styles.linkContainer}>
                    <input 
                      type="text" 
                      readOnly 
                      value={getShareUrl()} 
                      style={styles.linkInput}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button 
                      onClick={handleCopy} 
                      style={styles.btnCopy}
                      title="Copy Link"
                    >
                      {copied ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
                    </button>
                  </div>
                ) : (
                  <div style={styles.emptyLinkText}>
                    No active invitation link. Create one to invite collaborators.
                  </div>
                )}

                {role === 'admin' ? (
                  <button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    style={inviteToken ? styles.btnRevoke : styles.btnGenerate}
                  >
                    {isGenerating ? 'Generating...' : inviteToken ? 'Revoke & Create New Link' : 'Generate Invite Link'}
                  </button>
                ) : (
                  <div style={styles.viewerNote}>
                    Only administrators can manage invite links.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: { 
    position: 'absolute', 
    top: '20px', 
    left: '20px', 
    right: '20px',
    height: '60px', 
    borderRadius: 'var(--radius-md)', 
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0 16px', 
    zIndex: 10 
  },
  headerLeft: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px' 
  },
  btnBack: { 
    padding: '8px', 
    cursor: 'pointer', 
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text-secondary)', 
    display: 'flex', 
    alignItems: 'center' 
  },
  boardInfo: { 
    display: 'flex', 
    flexDirection: 'column' 
  },
  boardName: { 
    fontSize: '15px', 
    fontWeight: 700 
  },
  boardMeta: { 
    fontSize: '11px', 
    color: 'var(--color-text-muted)', 
    display: 'flex',
    alignItems: 'center', 
    gap: '4px', 
    textTransform: 'uppercase' 
  },
  headerRight: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '16px' 
  },
  collaboratorStack: { 
    display: 'flex', 
    alignItems: 'center' 
  },
  avatar: { 
    width: '28px', 
    height: '28px', 
    borderRadius: '50%', 
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '11px', 
    fontWeight: 700,
    color: '#fff', 
    overflow: 'hidden', 
    border: '2px solid var(--color-border)' 
  },
  avatarImg: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' 
  },
  savedStatus: { 
    fontSize: '12px', 
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  btnAction: { 
    padding: '6px 12px', 
    cursor: 'pointer', 
    color: 'var(--color-text-secondary)',
    display: 'flex', 
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--color-bg-elevated)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    fontSize: '12px',
    fontWeight: 600,
  },
  exportText: {
    textTransform: 'uppercase',
  },
  exportDropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    right: 0,
    backgroundColor: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '140px',
    overflow: 'hidden',
    zIndex: 20
  },
  dropdownItem: {
    padding: '10px 12px',
    cursor: 'pointer',
    color: 'var(--color-text-primary)',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 500,
    width: '100%',
    transition: 'var(--transition-fast)'
  },
  sharePopover: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    right: 0,
    backgroundColor: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    width: '320px',
    padding: '16px',
    zIndex: 20,
  },
  popoverHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '8px',
  },
  popoverTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  popoverContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  linkContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--color-bg-secondary)',
    overflow: 'hidden',
  },
  linkInput: {
    flex: 1,
    padding: '8px 10px',
    fontSize: '12px',
    color: 'var(--color-text-primary)',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    width: '1px',
  },
  btnCopy: {
    padding: '8px 10px',
    backgroundColor: 'transparent',
    border: 'none',
    borderLeft: '1px solid var(--color-border)',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    transition: 'var(--transition-fast)',
  },
  btnGenerate: {
    padding: '10px',
    backgroundColor: 'var(--color-accent-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    backgroundImage: 'var(--color-accent-gradient)',
    transition: 'var(--transition-fast)',
  },
  btnRevoke: {
    padding: '8px',
    backgroundColor: 'transparent',
    color: 'var(--color-error)',
    border: '1px solid var(--color-error)',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    textAlign: 'center',
  },
  emptyLinkText: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '12px 0',
  },
  viewerNote: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
  }
};
