import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  GitCommit, 
  ChevronDown, 
  Check, 
  Info, 
  Key, 
  Trash2, 
  Database, 
  Github, 
  Eye, 
  EyeOff, 
  Lock, 
  Shield, 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  FileText,
  AlertCircle,
  Copy,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  RefreshCw,
  PlusCircle,
  Building,
  Send,
  Terminal,
  Activity,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SquadUser } from './types';
import { USER_TYPES, ACCESS_LEVELS, TITLES, SEXES, INITIAL_USERS } from './data';

export default function App() {
  // Navigation State (Left Navigation Bar)
  const [activeTab, setActiveTab] = useState<'register' | 'directory' | 'gitsync' | 'configure' | 'institutions'>('register');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('squad_sidebar_collapsed');
    return saved === 'true';
  });

  // Dynamic Classification Lists - start empty and load from backend
  const [userTypesList, setUserTypesList] = useState<{ id: string, label: string }[]>([]);

  const [accessLevelsList, setAccessLevelsList] = useState<{ id: number, label: string }[]>(() => {
    // Force reset to new access levels (Level 1-6)
    localStorage.removeItem('squad_access_levels');
    return ACCESS_LEVELS;
  });

  const [titlesList, setTitlesList] = useState<string[]>(() => {
    const saved = localStorage.getItem('squad_titles');
    return saved ? JSON.parse(saved) : TITLES;
  });
  const [remoteTitlesList, setRemoteTitlesList] = useState<string[]>([]);
  const [titlesLoading, setTitlesLoading] = useState<boolean>(false);

  const [sexesList, setSexesList] = useState<{ id: string, label: string }[]>(() => {
    const saved = localStorage.getItem('squad_sexes');
    return saved ? JSON.parse(saved) : SEXES;
  });

  const [institutionsList, setInstitutionsList] = useState<{ id: string, name: string, is_active: string }[]>(() => {
    const saved = localStorage.getItem('squad_institutions');
    return saved ? JSON.parse(saved) : [
      { id: 'inst_1', name: 'Your Institute Name', is_active: 'true' }
    ];
  });

  const [gradesList, setGradesList] = useState<{ id: string, grade: string }[]>(() => {
    const saved = localStorage.getItem('squad_grades');
    return saved ? JSON.parse(saved) : [];
  });

  const [sectionsList, setSectionsList] = useState<string[]>(() => {
    const saved = localStorage.getItem('squad_sections');
    return saved ? JSON.parse(saved) : [];
  });
  const [remoteSectionsList, setRemoteSectionsList] = useState<string[]>([]);

  // Server state parameters
  const [serverVersion, setServerVersion] = useState<string>(() => {
    return localStorage.getItem('squad_server_version') || 'v1.0';
  });

  const [serverStatus, setServerStatus] = useState<'online' | 'maintenance' | 'offline'>(() => {
    return (localStorage.getItem('squad_server_status') as any) || 'online';
  });


  // Clear stale data from localStorage on first load (only titles and grades)
  useEffect(() => {
    localStorage.removeItem('squad_titles');
    localStorage.removeItem('squad_grades');
    // Note: NOT clearing squad_user_types here - backend is source of truth
  }, []);

    // Synchronize dynamic parameters to localStorage
  useEffect(() => {
    if (userTypesList.length > 0) {
      localStorage.setItem('squad_user_types', JSON.stringify(userTypesList));
    }
  }, [userTypesList]);

  useEffect(() => {
    localStorage.setItem('squad_access_levels', JSON.stringify(accessLevelsList));
  }, [accessLevelsList]);

  useEffect(() => {
    localStorage.setItem('squad_titles', JSON.stringify(titlesList));
  }, [titlesList]);

  useEffect(() => {
    localStorage.setItem('squad_sexes', JSON.stringify(sexesList));
  }, [sexesList]);

  useEffect(() => {
    localStorage.setItem('squad_institutions', JSON.stringify(institutionsList));
  }, [institutionsList]);

  useEffect(() => {
    localStorage.setItem('squad_grades', JSON.stringify(gradesList));
  }, [gradesList]);

  useEffect(() => {
    localStorage.setItem('squad_sections', JSON.stringify(sectionsList));
  }, [sectionsList]);

  useEffect(() => {
    localStorage.setItem('squad_server_version', serverVersion);
  }, [serverVersion]);

  useEffect(() => {
    localStorage.setItem('squad_server_status', serverStatus);
  }, [serverStatus]);

  // Toggle helper
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('squad_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Directory & Form state
  const [users, setUsers] = useState<SquadUser[]>(() => {
    const saved = localStorage.getItem('squad_portal_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // State for active JSON payload view in the directory
  const [selectedUserJson, setSelectedUserJson] = useState<string | null>(null);

  // Form Fields State (Precisely the 13 parameters)
  const [userTypeId, setUserTypeId] = useState<string>(() => {
    // Default to first user type label, or 'student' if empty
    return userTypesList.length > 0 ? userTypesList[0].label : 'student';
  });
  const [nic, setNic] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [passport, setPassport] = useState<string>('');
  const [titleId, setTitleId] = useState<string>('Mr');
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [sex, setSex] = useState<string>('male');
  const [dob, setDob] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [accessLevelId, setAccessLevelId] = useState<number>(4);
  const [organizationId, setOrganizationId] = useState<string>('');
  const [remoteOrganizations, setRemoteOrganizations] = useState<{ _id: string, name: string }[]>([]);
  const [orgsLoading, setOrgsLoading] = useState<boolean>(false);

  // Auxiliary UI States
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Git Sync Simulator States
  const [gitRepo, setGitRepo] = useState('https://github.com/jacksonmongbam123/SQUAD.git');
  const [gitBranch, setGitBranch] = useState('main');
  const [gitToken, setGitToken] = useState(() => localStorage.getItem('squad_git_token') || (import.meta as any).env.VITE_GIT_TOKEN || '');
  const [commitMessage, setCommitMessage] = useState('feat: Add institution and grade configuration with real-time HTTP POST integration');
  const [isPushing, setIsPushing] = useState(false);
  const [pushLogs, setPushLogs] = useState<string[]>([]);
  const [pushSuccess, setPushSuccess] = useState(false);

  // ABMS API token — stored from login, used for authenticated delete operations
  const [abmsToken, setAbmsToken] = useState<string>(() => localStorage.getItem('squad_abms_token') || '');
  const [abmsUsername, setAbmsUsername] = useState('');
  const [abmsPassword, setAbmsPassword] = useState('');
  const [abmsLoginError, setAbmsLoginError] = useState('');
  const [abmsLoginLoading, setAbmsLoginLoading] = useState(false);
  const [showAbmsLogin, setShowAbmsLogin] = useState(false);
  // Store pending delete id while waiting for login
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('squad_abms_token', abmsToken);
  }, [abmsToken]);

  const handleAbmsLogin = async () => {
    if (!abmsUsername || !abmsPassword) return;
    setAbmsLoginLoading(true);
    setAbmsLoginError('');
    try {
      const res = await fetch('https://abms-lkw9.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ username: abmsUsername, password: abmsPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAbmsToken(data.token);
        setShowAbmsLogin(false);
        setAbmsUsername('');
        setAbmsPassword('');
        // Retry the pending delete if any
        if (pendingDeleteId) {
          const pid = pendingDeleteId;
          setPendingDeleteId(null);
          setTimeout(() => handleDelete(pid, data.token), 100);
        }
      } else {
        setAbmsLoginError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setAbmsLoginError(err.message || 'Network error');
    } finally {
      setAbmsLoginLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('squad_git_token', gitToken);
  }, [gitToken]);

  // Fetch organizations from ABMS backend on mount and sync into institutionsList
  useEffect(() => {
    const fetchOrgs = async () => {
      setOrgsLoading(true);
      try {
        const res = await fetch('https://abms-lkw9.onrender.com/df/institute/all');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setRemoteOrganizations(data);
            // Sync backend institutions into institutionsList so they survive restarts
            setInstitutionsList(prev => {
              const merged = [...prev];
              data.forEach((org: { _id: string; name: string; is_active?: string }) => {
                const exists = merged.some(inst => inst.name.toLowerCase() === org.name.toLowerCase());
                if (!exists) {
                  merged.push({ id: org._id, name: org.name, is_active: org.is_active || 'true' });
                }
              });
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch organizations from backend:', err);
      } finally {
        setOrgsLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  // Fetch titles from ABMS backend on mount and sync with local state
  useEffect(() => {
    const fetchTitles = async () => {
      setTitlesLoading(true);
      try {
        const res = await fetch('https://abms-lkw9.onrender.com/df/title/all');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const titles = data.map((t: any) => typeof t === 'string' ? t : t.title);
            setRemoteTitlesList(titles);
            // Sync titlesList with backend: use remote titles as source of truth,
            // keeping any locally-added titles that aren't in the remote list yet
            setTitlesList(prev => {
              const localOnly = prev.filter(t => !titles.includes(t));
              const merged = [...titles, ...localOnly];
              localStorage.setItem('squad_titles', JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch titles from backend:', err);
      } finally {
        setTitlesLoading(false);
      }
    };
    fetchTitles();
  }, []);

  // Fetch grades and user types from ABMS backend on mount and sync with local state
  useEffect(() => {
    const fetchGradesAndUserTypes = async () => {
      try {
        // Fetch grades
        const gradesRes = await fetch('https://abms-lkw9.onrender.com/df/grade/all');
        if (gradesRes.ok) {
          const gradesData = await gradesRes.json();
          if (Array.isArray(gradesData) && gradesData.length > 0) {
            const remoteGrades = gradesData.map((g: any) => ({ id: g._id || g.id, grade: typeof g === 'string' ? g : g.grade }));
            setGradesList(prev => {
              const localOnly = prev.filter(lg => !remoteGrades.some((rg: { grade: string }) => rg.grade === lg.grade));
              const merged = [...remoteGrades, ...localOnly];
              localStorage.setItem('squad_grades', JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch grades from backend:', err);
      }

      try {
        // Fetch user types - backend data is the source of truth
        const userTypesRes = await fetch('https://abms-lkw9.onrender.com/df/userType/all');
        if (userTypesRes.ok) {
          const userTypesData = await userTypesRes.json();
          if (Array.isArray(userTypesData) && userTypesData.length > 0) {
            const remoteUserTypes = userTypesData.map((ut: any) => ({ id: ut._id || ut.id, label: typeof ut === 'string' ? ut : ut.type_name }));
            // Use backend data as source of truth - replace local data completely
            setUserTypesList(remoteUserTypes);
            localStorage.setItem('squad_user_types', JSON.stringify(remoteUserTypes));
          } else if (Array.isArray(userTypesData) && userTypesData.length === 0) {
            // Backend has no user types, clear local data too
            setUserTypesList([]);
            localStorage.setItem('squad_user_types', JSON.stringify([]));
          }
        }
      } catch (err) {
        console.warn('Could not fetch user types from backend:', err);
      }
    };
    fetchGradesAndUserTypes();
  }, []);

  // States for adding new items in the Configure panel
  const [newUserTypeLabel, setNewUserTypeLabel] = useState('');
  const [newAccessLevelId, setNewAccessLevelId] = useState('');
  const [newAccessLevelLabel, setNewAccessLevelLabel] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSexId, setNewSexId] = useState('');
  const [newSexLabel, setNewSexLabel] = useState('');
  const [newInstName, setNewInstName] = useState('');
  const [newInstIsActive, setNewInstIsActive] = useState('true');

  // Institution remote API synchronization states
  const [isPostingInst, setIsPostingInst] = useState(false);
  const [instPostLogs, setInstPostLogs] = useState<string[]>([]);
  const [instPostStatus, setInstPostStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [instPostErrorMsg, setInstPostErrorMsg] = useState<string | null>(null);

  // Grade remote API synchronization states
  const [newGradeName, setNewGradeName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [isPostingGrade, setIsPostingGrade] = useState(false);
  const [gradePostLogs, setGradePostLogs] = useState<string[]>([]);
  const [gradePostStatus, setGradePostStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [gradePostErrorMsg, setGradePostErrorMsg] = useState<string | null>(null);

  // User registration remote API synchronization states
  const [isPostingRegister, setIsPostingRegister] = useState(false);
  const [registerPostLogs, setRegisterPostLogs] = useState<string[]>([]);
  const [registerPostStatus, setRegisterPostStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [registerPostErrorMsg, setRegisterPostErrorMsg] = useState<string | null>(null);

  const handleAddUserType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserTypeLabel.trim()) return;
    const cleanLabel = newUserTypeLabel.trim();
    if (userTypesList.some(ut => ut.label.toLowerCase() === cleanLabel.toLowerCase())) {
      alert('User Type already exists');
      return;
    }

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/userType/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type_name: cleanLabel })
      });

      if (response.ok) {
        const cleanId = cleanLabel.toLowerCase().replace(/\s+/g, '_');
        setUserTypesList([...userTypesList, { id: cleanId, label: cleanLabel }]);
        setNewUserTypeLabel('');
        setSuccessToast(`Added User Type: ${cleanLabel}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        alert(error.message || error.error || 'Failed to add user type');
      }
    } catch (err) {
      console.error('Error adding user type:', err);
      alert('Error connecting to backend');
    }
  };

  const handleDeleteUserType = async (id: string) => {
    if (userTypesList.length <= 1) {
      alert('Must keep at least one User Type!');
      return;
    }
    const userType = userTypesList.find(ut => ut.id === id);
    if (!userType) return;

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/userType/delete-by-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userType.label })
      });

      if (response.ok) {
        // Only remove from local state after successful backend delete
        const updatedList = userTypesList.filter(ut => ut.id !== id);
        setUserTypesList(updatedList);
        localStorage.setItem('squad_user_types', JSON.stringify(updatedList));
        setSuccessToast(`Deleted User Type: ${userType.label}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        let errorMsg = 'Failed to delete user type';
        try {
          const error = await response.json();
          errorMsg = error.message || error.error || errorMsg;
        } catch {}
        alert(`Failed to delete from database: ${errorMsg}. Please try again.`);
      }
    } catch (err) {
      console.error('Error deleting user type:', err);
      alert('Error connecting to backend. Please check your connection and try again.');
    }
  };

  const handleAddAccessLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccessLevelId.trim() || !newAccessLevelLabel.trim()) return;
    const cleanId = Number(newAccessLevelId.trim());
    if (isNaN(cleanId) || cleanId < 1 || cleanId > 6) {
      alert('Access Level ID must be a number between 1 and 6');
      return;
    }
    if (accessLevelsList.some(al => al.id === cleanId)) {
      alert('Access Level ID already exists');
      return;
    }
    setAccessLevelsList([...accessLevelsList, { id: cleanId, label: newAccessLevelLabel.trim() }]);
    setNewAccessLevelId('');
    setNewAccessLevelLabel('');
    setSuccessToast(`Added Access Level: ${newAccessLevelLabel}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDeleteAccessLevel = (id: string) => {
    if (accessLevelsList.length <= 1) {
      alert('Must keep at least one Access Level!');
      return;
    }
    setAccessLevelsList(accessLevelsList.filter(al => al.id !== id));
  };

  const handleAddTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const cleanTitle = newTitle.trim();
    if (titlesList.includes(cleanTitle) || remoteTitlesList.includes(cleanTitle)) {
      alert('Title already exists');
      return;
    }

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/title/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: cleanTitle })
      });

      if (response.ok) {
        const data = await response.json();
        setTitlesList([...titlesList, cleanTitle]);
        setRemoteTitlesList([...remoteTitlesList, cleanTitle]);
        setNewTitle('');
        setSuccessToast(`Added Title: ${cleanTitle}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        alert(error.message || error.error || 'Failed to add title');
      }
    } catch (err) {
      console.error('Error adding title:', err);
      alert('Error connecting to backend');
    }
  };

  const handleDeleteTitle = async (title: string) => {
    if (titlesList.length <= 1 && remoteTitlesList.length <= 1) {
      alert('Must keep at least one Title!');
      return;
    }

    // Remove from local state and localStorage immediately for responsive UI
    const updatedList = titlesList.filter(t => t !== title);
    setTitlesList(updatedList);
    setRemoteTitlesList(remoteTitlesList.filter(t => t !== title));
    localStorage.setItem('squad_titles', JSON.stringify(updatedList));

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/title/delete-by-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title })
      });

      if (response.ok) {
        setSuccessToast(`Deleted Title: ${title}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        let errorMsg = 'Failed to delete title';
        try {
          const error = await response.json();
          errorMsg = error.message || error.error || errorMsg;
        } catch {}
        // Backend delete failed, but item is already removed locally
        setSuccessToast(`Removed Title: ${title} locally (backend: ${errorMsg})`);
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err) {
      console.error('Error deleting title:', err);
      // Network error - item already removed locally, show info toast
      setSuccessToast(`Removed Title: ${title} locally (backend connection failed)`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleAddSex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSexId.trim() || !newSexLabel.trim()) return;
    const cleanId = newSexId.trim().toLowerCase().replace(/\s+/g, '_');
    if (sexesList.some(s => s.id === cleanId)) {
      alert('Gender ID already exists');
      return;
    }
    setSexesList([...sexesList, { id: cleanId, label: newSexLabel.trim() }]);
    setNewSexId('');
    setNewSexLabel('');
    setSuccessToast(`Added Gender: ${newSexLabel}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDeleteSex = (id: string) => {
    if (sexesList.length <= 1) {
      alert('Must keep at least one Gender option!');
      return;
    }
    setSexesList(sexesList.filter(s => s.id !== id));
  };

  const handlePostToRemoteManual = async (name: string, isActive: string) => {
    setIsPostingInst(true);
    setInstPostStatus('idle');
    setInstPostErrorMsg(null);
    const logTime = () => new Date().toLocaleTimeString();
    setInstPostLogs([
      `[${logTime()}] Initiating manual POST request to https://abms-lkw9.onrender.com/df/institute/add`,
      `[${logTime()}] Payload: { "name": "${name}", "is_active": "${isActive}" }`
    ]);

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/institute/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          is_active: isActive
        })
      });

      setInstPostLogs(prev => [...prev, `[${logTime()}] Response status code: ${response.status} (${response.statusText})`]);
      
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        setInstPostLogs(prev => [...prev, `[${logTime()}] Response JSON received successfully!`]);
      } catch (err) {
        responseData = responseText;
        setInstPostLogs(prev => [...prev, `[${logTime()}] Response raw text: ${responseText}`]);
      }

      setInstPostStatus('success');
      setInstPostLogs(prev => [
        ...prev, 
        `[${logTime()}] SUCCESS: Institution registered on remote server!`,
        `[${logTime()}] Server Data: ${JSON.stringify(responseData, null, 2)}`
      ]);
      setSuccessToast(`Remote POST Success for ${name}`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      setInstPostStatus('error');
      setInstPostErrorMsg(errMsg);
      setInstPostLogs(prev => [
        ...prev,
        `[${logTime()}] ERROR: Request failed.`,
        `[${logTime()}] Details: ${errMsg}`
      ]);
    } finally {
      setIsPostingInst(false);
    }
  };

  const handleAddInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstName.trim()) return;
    const name = newInstName.trim();
    if (institutionsList.some(inst => inst.name.toLowerCase() === name.toLowerCase())) {
      alert('An institution with this name already exists.');
      return;
    }

    setIsPostingInst(true);
    setInstPostStatus('idle');
    setInstPostErrorMsg(null);
    const logTime = () => new Date().toLocaleTimeString();
    setInstPostLogs([
      `[${logTime()}] Initiating POST request to https://abms-lkw9.onrender.com/df/institute/add`,
      `[${logTime()}] Payload: { "name": "${name}", "is_active": "${newInstIsActive}" }`
    ]);

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/institute/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          is_active: newInstIsActive
        })
      });

      setInstPostLogs(prev => [...prev, `[${logTime()}] Response status code: ${response.status} (${response.statusText})`]);
      
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        setInstPostLogs(prev => [...prev, `[${logTime()}] Response JSON received successfully!`]);
      } catch (err) {
        responseData = responseText;
        setInstPostLogs(prev => [...prev, `[${logTime()}] Response raw text: ${responseText}`]);
      }

      setInstPostStatus('success');
      setInstPostLogs(prev => [
        ...prev, 
        `[${logTime()}] SUCCESS: Institution registered on remote server!`,
        `[${logTime()}] Server Data: ${JSON.stringify(responseData, null, 2)}`
      ]);

      // Re-fetch remote organizations to keep in sync
      try {
        const refetchRes = await fetch('https://abms-lkw9.onrender.com/df/institute/all');
        if (refetchRes.ok) {
          const refetchData = await refetchRes.json();
          if (Array.isArray(refetchData)) {
            setRemoteOrganizations(refetchData);
            setInstPostLogs(prev => [...prev, `[${logTime()}] Re-fetched remote organizations list`]);
          }
        }
      } catch (refetchErr) {
        console.warn('Could not re-fetch organizations:', refetchErr);
      }

      const cleanId = 'inst_' + Date.now();
      let updated = [...institutionsList];
      setInstitutionsList([...updated, { id: cleanId, name, is_active: newInstIsActive }]);
      setNewInstName('');
      setNewInstIsActive('true');
      setSuccessToast(`Remote POST Success & Added Local Institution: ${name}`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      setInstPostStatus('error');
      setInstPostErrorMsg(errMsg);
      setInstPostLogs(prev => [
        ...prev,
        `[${logTime()}] ERROR: Request failed.`,
        `[${logTime()}] Details: ${errMsg}`
      ]);
      
      // Still append locally so user data is retained
      const cleanId = 'inst_' + Date.now();
      let updated = [...institutionsList];
      setInstitutionsList([...updated, { id: cleanId, name, is_active: newInstIsActive }]);
      setNewInstName('');
      setNewInstIsActive('true');
      setSuccessToast(`Added locally (Remote POST failed: ${errMsg})`);
      setTimeout(() => setSuccessToast(null), 4000);
    } finally {
      setIsPostingInst(false);
    }
  };

  const handleDeleteInstitution = async (id: string) => {
    if (institutionsList.length <= 1) {
      alert('Must keep at least one Institution!');
      return;
    }

    const inst = institutionsList.find(i => i.id === id);
    if (!inst) return;

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/institute/delete-by-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inst.name })
      });

      if (response.ok) {
        setInstitutionsList(institutionsList.filter(i => i.id !== id));
        setSuccessToast(`Deleted Institution: ${inst.name}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        alert(error.message || error.error || 'Failed to delete institution');
      }
    } catch (err) {
      console.error('Error deleting institution:', err);
      alert('Error connecting to backend');
    }
  };

  const handleToggleInstitutionActive = (id: string) => {
    setInstitutionsList(institutionsList.map(inst => {
      if (inst.id === id) {
        return { ...inst, is_active: inst.is_active === 'true' ? 'false' : 'true' };
      }
      return inst;
    }));
  };

  const handlePostGradeToRemoteManual = async (gradeName: string) => {
    setIsPostingGrade(true);
    setGradePostStatus('idle');
    setGradePostErrorMsg(null);
    const logTime = () => new Date().toLocaleTimeString();
    setGradePostLogs([
      `[${logTime()}] Initiating manual POST request to https://abms-lkw9.onrender.com/df/grade/add`,
      `[${logTime()}] Payload: { "grade": "${gradeName}" }`
    ]);

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/grade/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          grade: gradeName
        })
      });

      setGradePostLogs(prev => [...prev, `[${logTime()}] Response status code: ${response.status} (${response.statusText})`]);
      
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        setGradePostLogs(prev => [...prev, `[${logTime()}] Response JSON received successfully!`]);
      } catch (err) {
        responseData = responseText;
        setGradePostLogs(prev => [...prev, `[${logTime()}] Response raw text: ${responseText}`]);
      }

      setGradePostStatus('success');
      setGradePostLogs(prev => [
        ...prev, 
        `[${logTime()}] SUCCESS: Grade registered on remote server!`,
        `[${logTime()}] Server Data: ${JSON.stringify(responseData, null, 2)}`
      ]);
      setSuccessToast(`Remote POST Success for ${gradeName}`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      setGradePostStatus('error');
      setGradePostErrorMsg(errMsg);
      setGradePostLogs(prev => [
        ...prev,
        `[${logTime()}] ERROR: Request failed.`,
        `[${logTime()}] Details: ${errMsg}`
      ]);
    } finally {
      setIsPostingGrade(false);
    }
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGradeName.trim()) return;
    const grade = newGradeName.trim();
    if (gradesList.some(g => g.grade.toLowerCase() === grade.toLowerCase())) {
      alert('Grade already exists');
      return;
    }

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/grade/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grade })
      });

      if (response.ok) {
        const cleanId = 'grade_' + Date.now();
        setGradesList([...gradesList, { id: cleanId, grade }]);
        setNewGradeName('');
        setSuccessToast(`Added Grade: ${grade}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        alert(error.message || error.error || 'Failed to add grade');
      }
    } catch (err) {
      console.error('Error adding grade:', err);
      alert('Error connecting to backend');
    }
  };

  const handleDeleteGrade = async (id: string) => {
    if (gradesList.length <= 1) {
      alert('Must keep at least one Grade option!');
      return;
    }
    const grade = gradesList.find(g => g.id === id);
    if (!grade) return;

    // Remove from local state and localStorage immediately for responsive UI
    const updatedList = gradesList.filter(g => g.id !== id);
    setGradesList(updatedList);
    localStorage.setItem('squad_grades', JSON.stringify(updatedList));

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/grade/delete-by-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: grade.grade })
      });

      if (response.ok) {
        setSuccessToast(`Deleted Grade: ${grade.grade}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        let errorMsg = 'Failed to delete grade';
        try {
          const error = await response.json();
          errorMsg = error.message || error.error || errorMsg;
        } catch {}
        // Backend delete failed, but item is already removed locally
        setSuccessToast(`Removed Grade: ${grade.grade} locally (backend: ${errorMsg})`);
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err) {
      console.error('Error deleting grade:', err);
      // Network error - item already removed locally, show info toast
      setSuccessToast(`Removed Grade: ${grade.grade} locally (backend connection failed)`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleResetConfig = () => {
    if (confirm('Are you sure you want to reset SQUAD Portal configuration to factory defaults?')) {
      setUserTypesList(USER_TYPES);
      setAccessLevelsList(ACCESS_LEVELS);
      setTitlesList(TITLES);
      setSexesList(SEXES);
      setInstitutionsList([
        { id: 'inst_1', name: 'Your Institute Name', is_active: 'true' }
      ]);
      setGradesList([
        { id: 'grade_1', grade: 'Grade 10' },
        { id: 'grade_2', grade: 'Grade 11' }
      ]);
      setServerVersion('v1.0');
      setServerStatus('online');
      setSuccessToast('Successfully reset configuration defaults!');
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  // Save users state locally
  useEffect(() => {
    localStorage.setItem('squad_portal_users', JSON.stringify(users));
  }, [users]);

  // Form Validations
  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!nic.trim()) errors.nic = 'NIC parameter is required';
    if (!password.trim()) errors.password = 'Password parameter is required';
    if (!email.trim()) {
      errors.email = 'Email parameter is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email parameter format';
    }
    if (!passport.trim()) errors.passport = 'Passport parameter is required';
    if (!firstName.trim()) errors.first_name = 'First name is required';
    if (!lastName.trim()) errors.last_name = 'Last name is required';
    if (!dob.trim()) errors.dob = 'Date of birth is required';
    if (!phone.trim()) errors.phone = 'Phone number parameter is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newRecord: SquadUser = {
      id: `user_${Date.now()}`,
      user_type_id: userTypeId,
      nic: nic.trim(),
      password: password.trim(),
      email: email.trim().toLowerCase(),
      passport: passport.trim(),
      title_id: titleId,
      first_name: firstName.trim(),
      middle_name: middleName.trim(),
      last_name: lastName.trim(),
      sex: sex,
      dob: dob,
      phone: phone.trim(),
      access_level_id: accessLevelId,
      organization_id: organizationId || undefined
    };

    setIsPostingRegister(true);
    setRegisterPostStatus('idle');
    setRegisterPostErrorMsg(null);
    const logTime = () => new Date().toLocaleTimeString();

    setRegisterPostLogs([
      `[${logTime()}] Initiating real-time POST request to https://abms-lkw9.onrender.com/df/register/add`,
      `[${logTime()}] Payload parameters: ${JSON.stringify({
        user_type_id: newRecord.user_type_id,
        nic: newRecord.nic,
        password: newRecord.password,
        email: newRecord.email,
        passport: newRecord.passport,
        title_id: newRecord.title_id,
        first_name: newRecord.first_name,
        middle_name: newRecord.middle_name,
        last_name: newRecord.last_name,
        sex: newRecord.sex,
        dob: newRecord.dob,
        phone: newRecord.phone,
        access_level_id: newRecord.access_level_id,
        organization_id: newRecord.organization_id || null
      }, null, 2)}`
    ]);

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/register/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_type_id: newRecord.user_type_id,
          nic: newRecord.nic,
          password: newRecord.password,
          email: newRecord.email,
          passport: newRecord.passport,
          title_id: newRecord.title_id,
          first_name: newRecord.first_name,
          middle_name: newRecord.middle_name,
          last_name: newRecord.last_name,
          sex: newRecord.sex,
          dob: newRecord.dob,
          phone: newRecord.phone,
          access_level_id: newRecord.access_level_id,
          organization_id: newRecord.organization_id || undefined
        })
      });

      setRegisterPostLogs(prev => [...prev, `[${logTime()}] Response status code: ${response.status} (${response.statusText})`]);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        setRegisterPostLogs(prev => [...prev, `[${logTime()}] Response JSON received successfully!`]);
      } catch (err) {
        responseData = responseText;
        setRegisterPostLogs(prev => [...prev, `[${logTime()}] Response raw text: ${responseText}`]);
      }

      setRegisterPostStatus('success');
      setRegisterPostLogs(prev => [
        ...prev,
        `[${logTime()}] SUCCESS: Member registered on remote server!`,
        `[${logTime()}] Server Response: ${typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : responseData}`
      ]);

      // Capture the real MongoDB _id from the response so delete can use it later
      const dbId = responseData?.createdParent?._id
        || responseData?.createdStudent?._id
        || responseData?.createdTeacher?._id
        || responseData?._id
        || undefined;

      setUsers(prevUsers => [{ ...newRecord, dbId }, ...prevUsers]);
      setSuccessToast("successful");
      setTimeout(() => setSuccessToast(null), 5000);

      // Clear form inputs on success
      setNic('');
      setPassword('');
      setEmail('');
      setPassport('');
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setDob('');
      setPhone('');
      setOrganizationId('');
      setFormErrors({});

      // Jump to directory tab to view the payload
      setActiveTab('directory');
      setSelectedUserJson(newRecord.id);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      setRegisterPostStatus('error');
      setRegisterPostErrorMsg(errMsg);
      setRegisterPostLogs(prev => [
        ...prev,
        `[${logTime()}] ERROR: Remote registration failed.`,
        `[${logTime()}] Details: ${errMsg}`
      ]);

      setSuccessToast("not able to register");
      setTimeout(() => setSuccessToast(null), 5000);
    } finally {
      setIsPostingRegister(false);
    }
  };

  // Delete User Record
  const handleDelete = async (id: string, tokenOverride?: string) => {
    if (confirm('Delete this user record from SQUAD Portal?')) {
      const user = users.find(u => u.id === id);
      if (!user) return;

      const dbId = user.dbId;
      if (!dbId) {
        alert('Cannot delete: this record has no database ID (it may have been created before this fix). Please remove it manually from the database.');
        setUsers(users.filter(u => u.id !== id));
        if (selectedUserJson === id) setSelectedUserJson(null);
        return;
      }

      // Use provided token, stored abmsToken, or prompt login
      const token = tokenOverride || abmsToken;
      if (!token) {
        setPendingDeleteId(id);
        setShowAbmsLogin(true);
        return;
      }

      // Determine correct endpoint based on user_type_id
      const typeId = (user.user_type_id || '').toLowerCase();
      let endpoint = '';
      let method = 'DELETE';

      if (typeId === 'student') {
        endpoint = `https://abms-lkw9.onrender.com/m/student/delete/${dbId}`;
      } else if (typeId === 'instructor' || typeId === 'teacher') {
        endpoint = `https://abms-lkw9.onrender.com/m/teacher/delete/${dbId}`;
      } else if (typeId === 'parent' || typeId === 'parents') {
        endpoint = `https://abms-lkw9.onrender.com/m/parent/delete/${dbId}`;
        method = 'POST';
      } else if (typeId === 'administrator' || typeId === 'admin') {
        endpoint = `https://abms-lkw9.onrender.com/m/admin/delete/${dbId}`;
        method = 'POST';
      }

      if (!endpoint) {
        alert(`Unknown user type "${user.user_type_id}" — cannot determine delete endpoint.`);
        return;
      }

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid — clear it and prompt re-login
          setAbmsToken('');
          localStorage.removeItem('squad_abms_token');
          setPendingDeleteId(id);
          setShowAbmsLogin(true);
          return;
        }

        if (!response.ok) {
          const errText = await response.text();
          alert(`Failed to delete from database (${response.status}): ${errText}. Record NOT removed.`);
          return;
        }

        // Only remove from UI after confirmed DB deletion
        setUsers(users.filter(u => u.id !== id));
        if (selectedUserJson === id) setSelectedUserJson(null);
      } catch (err: any) {
        alert(`Network error while deleting: ${err.message}. Record NOT removed.`);
      }
    }
  };

  // Copy body parameters to clipboard
  const handleCopyJson = (user: SquadUser) => {
    const payload = {
      user_type_id: user.user_type_id,
      nic: user.nic,
      password: user.password,
      email: user.email,
      passport: user.passport,
      title_id: user.title_id,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      sex: user.sex,
      dob: user.dob,
      phone: user.phone,
      access_level_id: user.access_level_id
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Commit & Push Sync Simulator
  const handleGitPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPushing) return;

    setIsPushing(true);
    setPushSuccess(false);
    setPushLogs([]);

    const sequence = [
      `$ git remote add origin ${gitRepo}`,
      `$ git checkout -b ${gitBranch}`,
      `Connecting to remote repository...`,
      gitToken 
        ? `✔ Successfully authenticated with Personal Access Token (PAT) fingerprint: ...${gitToken.slice(-6) || 'active'}`
        : `⚠ Warning: No custom access token entered yet. Running in sandbox deployment...`,
      `Preparing delta of dropdown modifications...`,
      `[MODIFIED] /src/App.tsx  (Added institution and grade parameters with live REST API POST integrations)`,
      `Writing git packfile: 100% (2/2 files serialized)`,
      `Uploading branch "${gitBranch}" to remote JacksonMongbam123 repository...`,
      `✔ Commit successfully pushed to SQUAD repository on branch "${gitBranch}"!`
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < sequence.length) {
        setPushLogs(prev => [...prev, sequence[step]]);
        step++;
      } else {
        clearInterval(interval);
        setIsPushing(false);
        setPushSuccess(true);
      }
    }, 300);
  };

  const activeInstitution = institutionsList.find(inst => inst.is_active === 'true') || institutionsList[0];


  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    const cleanSection = newSectionName.trim();
    if (sectionsList.includes(cleanSection) || remoteSectionsList.includes(cleanSection)) {
      alert('Section already exists');
      return;
    }

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/section/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section: cleanSection })
      });

      if (response.ok) {
        setSectionsList([...sectionsList, cleanSection]);
        setRemoteSectionsList([...remoteSectionsList, cleanSection]);
        setNewSectionName('');
        setSuccessToast(`Added Section: ${cleanSection}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        alert(error.message || error.error || 'Failed to add section');
      }
    } catch (err) {
      console.error('Error adding section:', err);
      alert('Error connecting to backend');
    }
  };

  const handleDeleteSection = async (section: string) => {
    if (sectionsList.length <= 1 && remoteSectionsList.length <= 1) {
      alert('Must keep at least one Section!');
      return;
    }

    try {
      const response = await fetch('https://abms-lkw9.onrender.com/df/section/delete-by-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section })
      });

      if (response.ok) {
        setSectionsList(sectionsList.filter(s => s !== section));
        setRemoteSectionsList(remoteSectionsList.filter(s => s !== section));
        setSuccessToast(`Deleted Section: ${section}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        alert(error.message || error.error || 'Failed to delete section');
      }
    } catch (err) {
      console.error('Error deleting section:', err);
      alert('Error connecting to backend');
    }
  };


    return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">

      {/* ABMS Login Modal — shown when delete requires authentication */}
      {showAbmsLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-sm space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">ABMS Admin Login Required</h3>
              <p className="text-xs text-slate-500">Enter your admin credentials to authenticate delete operations.</p>
            </div>
            {abmsLoginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 font-medium">{abmsLoginError}</div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username / NIC / Reg No</label>
                <input
                  type="text"
                  value={abmsUsername}
                  onChange={e => setAbmsUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={abmsPassword}
                  onChange={e => setAbmsPassword(e.target.value)}
                  placeholder="Enter password"
                  onKeyDown={e => e.key === 'Enter' && handleAbmsLogin()}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setShowAbmsLogin(false); setPendingDeleteId(null); setAbmsLoginError(''); }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAbmsLogin}
                disabled={abmsLoginLoading || !abmsUsername || !abmsPassword}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {abmsLoginLoading ? 'Logging in...' : 'Login & Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 1. LEFT NAVIGATION BAR */}
      <aside className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Brand Header */}
        <div className={`h-16 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 transition-all duration-300 ${isSidebarCollapsed ? 'px-3' : 'px-4'}`}>
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="p-1.5 bg-indigo-600 rounded text-white shadow-sm shrink-0">
              <Building className="h-4.5 w-4.5" />
            </div>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="shrink-0"
              >
                <h1 className="text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap max-w-[130px] truncate" title={activeInstitution ? activeInstitution.name : 'SQUAD Portal'}>
                  {activeInstitution ? activeInstitution.name : 'SQUAD Portal'}
                </h1>
                <p className="text-[9px] font-mono text-slate-500 whitespace-nowrap">
                  {activeInstitution && activeInstitution.is_active === 'true' ? '● Active Institution' : 'SQUAD Workspace'}
                </p>
              </motion.div>
            )}
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-500 hover:text-slate-700 transition shrink-0"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            onClick={() => setActiveTab('register')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'register'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Register Member" : ""}
          >
            <UserPlus className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Register Member</span>}
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all relative ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'directory'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Registered Directory" : ""}
          >
            <Users className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Registered Directory</span>}
            {users.length > 0 && (
              isSidebarCollapsed ? (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-600 rounded-full" />
              ) : (
                <span className="ml-auto bg-slate-200 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {users.length}
                </span>
              )
            )}
          </button>


          <button
            onClick={() => setActiveTab('configure')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'configure'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Configure Options" : ""}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Configure</span>}
          </button>

          <button
            onClick={() => setActiveTab('institutions')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'institutions'
                ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Manage Institutions" : ""}
          >
            <Building className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Institutions</span>}
          </button>
        </nav>

        {/* User context footer */}
        <div className={`p-4 border-t border-slate-200 bg-slate-50/50 text-[11px] text-slate-500 font-mono transition-all duration-300 ${isSidebarCollapsed ? 'flex justify-center' : 'space-y-1.5'}`}>
          {isSidebarCollapsed ? (
            <div className="flex items-center justify-center relative group">
              <span className={`h-2 w-2 rounded-full animate-pulse ${
                serverStatus === 'online' ? 'bg-emerald-500' : serverStatus === 'maintenance' ? 'bg-amber-500' : 'bg-rose-500'
              }`} />
              <div className="absolute left-10 bottom-0 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-md z-50">
                Server {serverVersion} ({serverStatus}) • explorealmamater
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
                <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                  serverStatus === 'online' ? 'bg-emerald-500' : serverStatus === 'maintenance' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                <span>SQUAD Server {serverVersion}</span>
                <span className={`text-[9px] uppercase px-1 rounded font-sans text-white font-bold scale-90 ${
                  serverStatus === 'online' ? 'bg-emerald-500' : serverStatus === 'maintenance' ? 'bg-amber-500' : 'bg-rose-500'
                }`}>
                  {serverStatus}
                </span>
              </div>
              <div className="truncate text-slate-400" title="explorealmamater@gmail.com">
                Active: explorealmamater
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 overflow-y-auto flex justify-center p-6 sm:p-10 bg-slate-50">
        
        <div className="w-full max-w-4xl space-y-6">
          
          {/* Notifications Success Toast */}
          <AnimatePresence>
            {successToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs font-medium flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <Check className="h-4.5 w-4.5 text-emerald-600" />
                  <span>{successToast}</span>
                </div>
                <button 
                  onClick={() => setSuccessToast(null)}
                  className="text-emerald-500 hover:text-emerald-700 font-mono font-bold"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Views Switcher */}
          <AnimatePresence mode="wait">
            {activeTab === 'register' && (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* 2. REGISTER NEW MEMBER CARD */}
                {/* Note: In accordance with instructions, this card represents the top boundary (nothing above) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  
                  {/* Card Title */}
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                      <UserPlus className="h-5 w-5 text-indigo-600" />
                      <span>Register New Member</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Configure standard SQUAD body parameter records. Fields correspond exactly to API parameters.
                    </p>
                  </div>

                  <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-6">
                    
                    {/* SECTION A: Human Classification */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                        1. Classification Parameters
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Dropdown User Type ID (Student, Teacher/Instructor, Administrator, Parent/Guardian) */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                            <span>User Type (user_type_id) *</span>
                            <span className="text-[10px] font-mono text-slate-400">Dropdown Selection</span>
                          </label>
                          <div className="relative">
                            <select
                              id="user_type_id"
                              value={userTypeId}
                              onChange={e => setUserTypeId(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                            >
                              {userTypesList.map(ut => (
                                <option key={ut.id} value={ut.label}>{ut.label}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        {/* Dropdown Access Level ID (Level 1 to Level 5) */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                            <span>Access Level (access_level_id) *</span>
                            <span className="text-[10px] font-mono text-slate-400">Dropdown Selection</span>
                          </label>
                          <div className="relative">
                            <select
                              id="access_level_id"
                              value={accessLevelId}
                              onChange={e => setAccessLevelId(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                            >
                              {accessLevelsList.map(al => (
                                <option key={al.id} value={al.id}>{al.label}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Institution / Organization mapping */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Building className="h-3.5 w-3.5 text-indigo-500" /> Institution (organization_id)</span>
                          <span className="text-[10px] font-mono text-slate-400">{orgsLoading ? 'Loading...' : `${remoteOrganizations.length} available`}</span>
                        </label>
                        <div className="relative">
                          <select
                            id="organization_id"
                            value={organizationId}
                            onChange={e => setOrganizationId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                          >
                            <option value="">— No institution assigned —</option>
                            {remoteOrganizations.map(org => (
                              <option key={org._id} value={org._id}>{org.name}</option>
                            ))}
                            {institutionsList.filter(inst => !remoteOrganizations.some(r => r.name === inst.name)).map(inst => (
                              <option key={inst.id} value={inst.id}>{inst.name} (local)</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Maps this member to an institution on the ABMS backend.</p>
                      </div>
                    </div>

                    {/* SECTION B: Identification Metrics */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                        2. Personal & Identity Metrics
                      </h3>

                      {/* Title, Gender, DOB Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Title (title_id)
                          </label>
                          <div className="relative">
                            <select
                              id="title_id"
                              value={titleId}
                              onChange={e => setTitleId(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                            >
                              {remoteTitlesList.map(t => {
                                const titleStr = typeof t === 'string' ? t : t.title;
                                return <option key={titleStr} value={titleStr}>{titleStr}</option>;
                              })}
                              {titlesList.filter(t => !remoteTitlesList.some(rt => (typeof rt === 'string' ? rt : rt.title) === t)).map(title => (
                                <option key={title} value={title}>{title} (local)</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Gender (sex)
                          </label>
                          <div className="relative">
                            <select
                              id="sex"
                              value={sex}
                              onChange={e => setSex(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                            >
                              {sexesList.map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Date of Birth (dob) *
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              id="dob"
                              value={dob}
                              onChange={e => setDob(e.target.value)}
                              className={`w-full bg-slate-50 border ${formErrors.dob ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                            />
                          </div>
                          {formErrors.dob && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.dob}</p>}
                        </div>
                      </div>

                      {/* Name Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (first_name) *</label>
                          <input
                            type="text"
                            id="first_name"
                            placeholder="e.g. Jenish"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.first_name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.first_name && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.first_name}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (middle_name)</label>
                          <input
                            type="text"
                            id="middle_name"
                            placeholder="e.g. J"
                            value={middleName}
                            onChange={e => setMiddleName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (last_name) *</label>
                          <input
                            type="text"
                            id="last_name"
                            placeholder="e.g. D"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.last_name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.last_name && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.last_name}</p>}
                        </div>
                      </div>
                    </div>

                    {/* SECTION C: Authentication & Credentials */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                        3. Server Credentials & Routing parameters
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">NIC (nic) *</label>
                          <input
                            type="text"
                            id="nic"
                            placeholder="e.g. jackson"
                            value={nic}
                            onChange={e => setNic(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.nic ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.nic && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.nic}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                            <span>Password (password) *</span>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-indigo-600 hover:text-indigo-800 text-[10px] font-mono"
                            >
                              {showPassword ? 'Hide Key' : 'Reveal Key'}
                            </button>
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              id="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              className={`w-full bg-slate-50 border ${formErrors.password ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg pl-3 pr-10 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <Lock className="h-3.5 w-3.5" />
                            </div>
                          </div>
                          {formErrors.password && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.password}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Email (email) *</label>
                          <input
                            type="email"
                            id="email"
                            placeholder="e.g. jacson@gmail.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.email && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Passport Identifier (passport) *</label>
                          <input
                            type="text"
                            id="passport"
                            placeholder="e.g. abcsd"
                            value={passport}
                            onChange={e => setPassport(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.passport ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.passport && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.passport}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number (phone) *</label>
                          <input
                            type="text"
                            id="phone"
                            placeholder="e.g. 8837092370"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.phone && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.phone}</p>}
                        </div>

                        <div className="flex items-end pb-0.5">
                          <p className="text-[11px] text-slate-400 italic">
                            * All input properties are verified to construct a valid JSON body with no extra properties.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Real-time remote POST status banner */}
                    {registerPostStatus !== 'idle' && (
                      <div className="mt-6">
                        {registerPostStatus === 'success' ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-xs font-semibold flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span className="text-sm font-bold uppercase tracking-wider">successful</span>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono font-bold">POST SUCCESS</span>
                          </div>
                        ) : (
                          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-xs font-semibold flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-pulse"></span>
                              <span className="text-sm font-bold uppercase tracking-wider">not able to register</span>
                            </div>
                            <span className="text-[10px] bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-mono font-bold">POST FAILED</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Live HTTP POST Console for Registration */}
                    {(registerPostLogs.length > 0 || isPostingRegister) && (
                      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg mt-4">
                        <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-[10px] font-mono text-slate-400">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="font-bold text-slate-300">REGISTRATION HTTP POST TERMINAL</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isPostingRegister ? (
                              <span className="text-amber-400 flex items-center gap-1">
                                <RefreshCw className="h-3 w-3 animate-spin" />
                                <span>SENDING...</span>
                              </span>
                            ) : registerPostStatus === 'success' ? (
                              <span className="text-emerald-400 font-bold">● SUCCESS (200 OK)</span>
                            ) : registerPostStatus === 'error' ? (
                              <span className="text-rose-400 font-bold">● FAILED</span>
                            ) : (
                              <span>IDLE</span>
                            )}
                            <button 
                              type="button" 
                              onClick={() => setRegisterPostLogs([])} 
                              className="hover:text-slate-200 ml-2"
                            >
                              Clear Logs
                            </button>
                          </div>
                        </div>
                        <div className="p-3 text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1 select-all scrollbar-thin">
                          {registerPostLogs.map((log, i) => {
                            let color = 'text-slate-300';
                            if (log.includes('SUCCESS') || log.includes('successful')) color = 'text-emerald-400 font-bold';
                            else if (log.includes('ERROR') || log.includes('failed') || log.includes('not able to register')) color = 'text-rose-400 font-bold';
                            else if (log.includes('Payload:')) color = 'text-amber-300';
                            else if (log.includes('Response status code:')) color = 'text-cyan-300';
                            return (
                              <div key={i} className={`${color} whitespace-pre-wrap leading-relaxed`}>
                                {log}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Submit Register button */}
                    {/* Note: In accordance with instructions, this button is the absolute bottom boundary (nothing below) */}
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        id="btn-register-submit"
                        disabled={isPostingRegister}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 text-white text-xs font-bold px-6 py-3 rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        {isPostingRegister ? (
                          <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        ) : (
                          <UserPlus className="h-4.5 w-4.5" />
                        )}
                        <span>{isPostingRegister ? 'Registering...' : 'Register SQUAD Member'}</span>
                      </button>
                    </div>

                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'directory' && (
              <motion.div
                key="directory-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                        <Users className="h-5 w-5 text-indigo-600" />
                        <span>Registered SQUAD Members</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Active records saved locally. Click a member to review or copy their raw JSON body parameters payload.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to restore default seed members?')) {
                          setUsers(INITIAL_USERS);
                          setSelectedUserJson(null);
                        }
                      }}
                      className="text-[10px] font-mono text-slate-500 hover:text-indigo-600 border border-slate-200 rounded px-2.5 py-1.5 bg-white hover:bg-slate-50 transition"
                    >
                      Restore Seed Data
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {users.length === 0 ? (
                      <div className="p-12 text-center space-y-3">
                        <Database className="h-8 w-8 text-slate-300 mx-auto" />
                        <h4 className="text-xs font-bold text-slate-700">No registered members found</h4>
                        <p className="text-xs text-slate-400">Click "Register Member" in the left sidebar to add records.</p>
                      </div>
                    ) : (
                      users.map(u => {
                        const isExpanded = selectedUserJson === u.id;
                        const userTypeMeta = userTypesList.find(t => t.id === u.user_type_id);
                        const accessLvlMeta = accessLevelsList.find(l => l.id === u.access_level_id);

                        return (
                          <div key={u.id} className="p-4 sm:p-6 hover:bg-slate-50/40 transition">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-slate-100 rounded-full text-slate-700 shrink-0 font-bold text-xs uppercase font-mono">
                                  {u.first_name[0]}{u.last_name[0]}
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{u.title_id}. {u.first_name} {u.middle_name} {u.last_name}</span>
                                    <span className="text-[10px] text-slate-400 font-normal">(@{u.nic})</span>
                                  </h4>
                                  
                                  <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <span className="text-[10px] bg-indigo-50 border border-indigo-100/50 text-indigo-700 px-2 py-0.5 rounded font-semibold font-mono">
                                      {userTypeMeta?.label || u.user_type_id}
                                    </span>
                                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold font-mono">
                                      {accessLvlMeta?.label || u.access_level_id}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      DOB: {u.dob} | Sex: {u.sex}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 self-end sm:self-auto">
                                <button
                                  onClick={() => setSelectedUserJson(isExpanded ? null : u.id)}
                                  className="text-xs font-mono text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 px-2.5 py-1.5 rounded transition"
                                >
                                  {isExpanded ? 'Hide Payload' : 'View Payload JSON'}
                                </button>
                                <button
                                  onClick={() => handleCopyJson(u)}
                                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded transition"
                                  title="Copy raw body parameters JSON"
                                >
                                  {copiedId === u.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                                </button>
                                <button
                                  onClick={() => handleDelete(u.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded transition"
                                  title="Delete record"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Collapsible JSON payload representation of requested body parameters */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden mt-4 pt-4 border-t border-slate-100"
                                >
                                  <div className="relative bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-slate-300">
                                    <div className="absolute right-3 top-3 flex items-center space-x-2">
                                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">BODY PARAMETERS PAYLOAD</span>
                                      <button
                                        onClick={() => handleCopyJson(u)}
                                        className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                                      >
                                        <Copy className="h-3 w-3" />
                                        <span>{copiedId === u.id ? 'Copied!' : 'Copy'}</span>
                                      </button>
                                    </div>
                                    <pre className="overflow-x-auto">
{`{
  "user_type_id": "${u.user_type_id}",
  "nic": "${u.nic}",
  "password": "${u.password}",
  "email": "${u.email}",
  "passport": "${u.passport}",
  "title_id": "${u.title_id}",
  "first_name": "${u.first_name}",
  "middle_name": "${u.middle_name}",
  "last_name": "${u.last_name}",
  "sex": "${u.sex}",
  "dob": "${u.dob}",
  "phone": "${u.phone}",
  "access_level_id": "${u.access_level_id}"
}`}
                                    </pre>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'gitsync' && (
              <motion.div
                key="gitsync-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                      <Github className="h-5 w-5 text-indigo-600" />
                      <span>Sync SQUAD Changes with GitHub</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Push your modified dropdown and body parameters schema commits directly to the SQUAD repository.
                    </p>
                  </div>

                  <form onSubmit={handleGitPush} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Repository Target URL</label>
                        <input
                          type="text"
                          value={gitRepo}
                          onChange={e => setGitRepo(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Branch</label>
                        <input
                          type="text"
                          value={gitBranch}
                          onChange={e => setGitBranch(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>Personal Access Token (PAT)</span>
                        <span className="text-[10px] text-indigo-600 font-mono">Will be provided to authorize write access</span>
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="ghp_************************************"
                          value={gitToken}
                          onChange={e => setGitToken(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Key className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Commit Message</label>
                      <textarea
                        rows={2}
                        value={commitMessage}
                        onChange={e => setCommitMessage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPushing}
                      className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      <GitCommit className="h-4 w-4" />
                      <span>{isPushing ? 'Syncing Repository...' : 'Commit & Push to GitHub'}</span>
                    </button>
                  </form>

                  {/* Terminal emulator logs */}
                  {pushLogs.length > 0 && (
                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-slate-300 space-y-1">
                      <p className="text-slate-500 pb-1 border-b border-slate-800 mb-2 uppercase tracking-widest text-[9px]">TERMINAL OUTPUT LOGS</p>
                      {pushLogs.map((log, idx) => (
                        <p key={idx} className={log.startsWith('✔') ? 'text-emerald-400' : log.startsWith('$') ? 'text-indigo-400' : 'text-slate-300'}>
                          {log}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'institutions' && (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-5xl mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Manage Institutions</h2>
                  <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                    {institutionsList.length} Institutions
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Building className="h-5 w-5 text-purple-600" />
                      Available Institutions
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold bg-slate-50 px-2.5 py-1 rounded">
                      {institutionsList.length} Options
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">
                    Manage institutions that admins can be assigned to. Multiple institutions can be active simultaneously.
                  </p>

                  <div className="space-y-2 border-t pt-4">
                    {institutionsList.map(inst => (
                      <div key={inst.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                        <div className="space-y-1">
                          <div className="font-medium text-slate-900 flex items-center gap-2">
                            <span>{inst.name}</span>
                            {inst.is_active === 'true' && (
                              <span className="text-xs bg-emerald-500 text-white font-bold px-2 py-0.5 rounded">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">ID: {inst.id}</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleInstitutionActive(inst.id)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded transition ${
                              inst.is_active === 'true'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {inst.is_active === 'true' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteInstitution(inst.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Add New Institution</h3>
                  <form onSubmit={handleAddInstitution} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Institution Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., St. Mary's School"
                        value={newInstName}
                        onChange={e => setNewInstName(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="inst_active"
                        checked={newInstIsActive === 'true'}
                        onChange={e => setNewInstIsActive(e.target.checked ? 'true' : 'false')}
                        className="rounded"
                      />
                      <label htmlFor="inst_active" className="text-sm text-slate-700">Set as active</label>
                    </div>
                    <button
                      type="submit"
                      disabled={isPostingInst}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      {isPostingInst ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Adding...
                        </span>
                      ) : (
                        'Add Institution'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

                    {activeTab === 'configure' && (
              <motion.div
                key="configure-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* 1. SQUAD Server Configuration card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                        <Settings className="h-5 w-5 text-indigo-600 animate-spin-slow" />
                        <span>SQUAD Portal Configuration</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Dynamically customize body parameters classification datasets, server metadata, and portal status.
                      </p>
                    </div>
                    <button
                      onClick={handleResetConfig}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-lg border border-rose-100 transition shrink-0 self-end sm:self-auto"
                    >
                      Reset to Defaults
                    </button>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Server Metadata Grid */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                        Portal Server Settings
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            SQUAD Server Version Label
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={serverVersion}
                              onChange={e => setServerVersion(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                              placeholder="v1.0"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1.5 font-sans">Changes are shown in the left sidebar footer status badge.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Portal Server Runtime State
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['online', 'maintenance', 'offline'] as const).map(status => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => setServerStatus(status)}
                                className={`text-[10px] font-bold px-3 py-2 rounded-lg border uppercase tracking-wider transition ${
                                  serverStatus === status
                                    ? status === 'online'
                                      ? 'bg-emerald-550 border-emerald-200 text-emerald-700 font-bold bg-emerald-50'
                                      : status === 'maintenance'
                                        ? 'bg-amber-550 border-amber-200 text-amber-700 font-bold bg-amber-50'
                                        : 'bg-rose-550 border-rose-200 text-rose-700 font-bold bg-rose-50'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1.5 font-sans">Applies status indicator colors dynamically throughout the environment.</p>
                        </div>
                      </div>
                    </div>

                    {/* Classification Parameter lists management */}
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                        Body Parameters & Dropdown Option Datasets
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* A. User Types */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">User Types (user_type_id)</span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {userTypesList.length} Options
                            </span>
                          </div>

                          <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {userTypesList.map(ut => (
                              <div key={ut.id} className="flex items-center justify-between py-1.5 text-xs">
                                <span className="font-semibold text-slate-800">{ut.label} <span className="text-[10px] font-mono font-normal text-slate-400">({ut.id})</span></span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUserType(ut.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                  title="Delete option"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handleAddUserType} className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Label (e.g. Guest)"
                              value={newUserTypeLabel}
                              onChange={e => setNewUserTypeLabel(e.target.value)}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 flex items-center justify-center transition shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </form>
                        </div>

                        {/* B. Access Levels */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Access Levels (access_level_id)</span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {accessLevelsList.length} Options
                            </span>
                          </div>

                          <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {accessLevelsList.map(al => (
                              <div key={al.id} className="flex items-center justify-between py-1.5 text-xs">
                                <span className="font-semibold text-slate-800">{al.label} <span className="text-[10px] font-mono font-normal text-slate-400">({al.id})</span></span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAccessLevel(al.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                  title="Delete option"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handleAddAccessLevel} className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="ID (e.g. 1-6)"
                              value={newAccessLevelId}
                              onChange={e => setNewAccessLevelId(e.target.value)}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <input
                              type="text"
                              required
                              placeholder="Label (e.g. Level 10)"
                              value={newAccessLevelLabel}
                              onChange={e => setNewAccessLevelLabel(e.target.value)}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 flex items-center justify-center transition shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </form>
                        </div>

                        {/* C. Titles */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Honorific Titles (title_id)</span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {titlesList.length} Options
                            </span>
                          </div>

                          <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {titlesList.map(title => (
                              <div key={title} className="flex items-center justify-between py-1.5 text-xs">
                                <span className="font-semibold text-slate-800">{title}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTitle(title)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                  title="Delete option"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handleAddTitle} className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="e.g. Prof"
                              value={newTitle}
                              onChange={e => setNewTitle(e.target.value)}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 flex items-center justify-center transition shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </form>
                        </div>

                        {/* D. Sexes / Genders */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Gender Choices (sex)</span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {sexesList.length} Options
                            </span>
                          </div>

                          <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {sexesList.map(s => (
                              <div key={s.id} className="flex items-center justify-between py-1.5 text-xs">
                                <span className="font-semibold text-slate-800">{s.label} <span className="text-[10px] font-mono font-normal text-slate-400">({s.id})</span></span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSex(s.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                  title="Delete option"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handleAddSex} className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="ID (e.g. other)"
                              value={newSexId}
                              onChange={e => setNewSexId(e.target.value)}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <input
                              type="text"
                              required
                              placeholder="Label (e.g. Other)"
                              value={newSexLabel}
                              onChange={e => setNewSexLabel(e.target.value)}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 flex items-center justify-center transition shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </form>
                        </div>

                        {/* E. Institutions */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition col-span-1 md:col-span-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <Building className="h-4 w-4 text-indigo-600" />
                              <span>Institution (institution config)</span>
                            </span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {institutionsList.length} Options
                            </span>
                          </div>

                          <p className="text-xs text-slate-500">
                            Configure available institutions. Adding a new institution automatically executes a real-time HTTP POST request with the required body parameters to the remote API.
                          </p>

                          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {institutionsList.map(inst => (
                              <div key={inst.id} className="flex items-center justify-between py-2 text-xs">
                                <div className="space-y-0.5">
                                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                                    <span>{inst.name}</span>
                                    {inst.is_active === 'true' && (
                                      <span className="text-[8px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3">
                                    <span>ID: {inst.id}</span>
                                    <span>is_active: "{inst.is_active}"</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handlePostToRemoteManual(inst.name, inst.is_active)}
                                    disabled={isPostingInst}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded transition border border-indigo-200 disabled:opacity-50 flex items-center gap-1"
                                    title="Post payload to https://abms-lkw9.onrender.com/df/institute/add"
                                  >
                                    <Send className="h-2.5 w-2.5" />
                                    <span>POST</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleInstitutionActive(inst.id)}
                                    className={`text-[10px] font-bold px-2 py-1 rounded transition border ${
                                      inst.is_active === 'true'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                    }`}
                                    title="Toggle active status"
                                  >
                                    {inst.is_active === 'true' ? 'Deactivate' : 'Activate'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteInstitution(inst.id)}
                                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                    title="Delete option"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Live REST API Terminal Logs */}
                          {instPostLogs.length > 0 && (
                            <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
                              <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-[10px] font-mono text-slate-400">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                  <span className="font-bold text-slate-300">HTTP POST TERMINAL</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isPostingInst ? (
                                    <span className="text-amber-400 flex items-center gap-1">
                                      <RefreshCw className="h-3 w-3 animate-spin" />
                                      <span>SENDING...</span>
                                    </span>
                                  ) : instPostStatus === 'success' ? (
                                    <span className="text-emerald-400 font-bold">● SUCCESS (200 OK)</span>
                                  ) : instPostStatus === 'error' ? (
                                    <span className="text-rose-400 font-bold">● FAILED</span>
                                  ) : (
                                    <span>IDLE</span>
                                  )}
                                  <button 
                                    type="button" 
                                    onClick={() => setInstPostLogs([])} 
                                    className="hover:text-slate-200 ml-2"
                                  >
                                    Clear Logs
                                  </button>
                                </div>
                              </div>
                              <div className="p-3 text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1 select-all scrollbar-thin">
                                {instPostLogs.map((log, i) => {
                                  let color = 'text-slate-300';
                                  if (log.includes('SUCCESS')) color = 'text-emerald-400 font-bold';
                                  else if (log.includes('ERROR') || log.includes('failed')) color = 'text-rose-400 font-bold';
                                  else if (log.includes('Payload:')) color = 'text-amber-300';
                                  else if (log.includes('Response status code:')) color = 'text-cyan-300';
                                  return (
                                    <div key={i} className={`${color} whitespace-pre-wrap leading-relaxed`}>
                                      {log}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <form onSubmit={handleAddInstitution} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                                Add New Institution Parameter & Send POST Request
                              </p>
                              <div className="text-[9px] text-indigo-600 bg-indigo-50 font-mono px-2 py-0.5 rounded font-semibold">
                                POST to /df/institute/add
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Institution Name (name)
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. SQUAD Academy"
                                  value={newInstName}
                                  onChange={e => setNewInstName(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Active State (is_active)
                                </label>
                                <select
                                  value={newInstIsActive}
                                  onChange={e => setNewInstIsActive(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                  <option value="true">"true" (Active)</option>
                                  <option value="false">"false" (Inactive)</option>
                                </select>
                              </div>
                            </div>

                            <div className="bg-slate-900 text-slate-300 rounded-lg p-3 text-[10px] font-mono relative">
                              <span className="absolute top-2 right-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-1.5 py-0.5 rounded">
                                SCHEMA BODY PARAMETER
                              </span>
                              <pre className="text-emerald-400">
{`{
  "name": "${newInstName || 'Your Institute Name'}",
  "is_active": "${newInstIsActive}"
}`}
                              </pre>
                            </div>

                            <div className="flex justify-end pt-1">
                              <button
                                type="submit"
                                disabled={isPostingInst}
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isPostingInst ? (
                                  <>
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                    <span>Adding...</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Add Institution</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* F. Grade */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition col-span-1 md:col-span-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <GraduationCap className="h-4 w-4 text-indigo-600" />
                              <span>Grade Configuration (grade config)</span>
                            </span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {gradesList.length} Options
                            </span>
                          </div>

                          <p className="text-xs text-slate-500">
                            Configure available grades. Adding a new grade automatically executes a real-time HTTP POST request with the required body parameters to the remote API.
                          </p>

                          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {gradesList.map(g => (
                              <div key={g.id} className="flex items-center justify-between py-2 text-xs">
                                <div className="space-y-0.5">
                                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                                    <span>{g.grade}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3">
                                    <span>ID: {g.id}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handlePostGradeToRemoteManual(g.grade)}
                                    disabled={isPostingGrade}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded transition border border-indigo-200 disabled:opacity-50 flex items-center gap-1"
                                    title="Post payload to https://abms-lkw9.onrender.com/df/grade/add"
                                  >
                                    <Send className="h-2.5 w-2.5" />
                                    <span>POST</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGrade(g.id)}
                                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                    title="Delete option"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Live REST API Terminal Logs */}
                          {gradePostLogs.length > 0 && (
                            <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
                              <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-[10px] font-mono text-slate-400">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                  <span className="font-bold text-slate-300">HTTP POST TERMINAL</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isPostingGrade ? (
                                    <span className="text-amber-400 flex items-center gap-1">
                                      <RefreshCw className="h-3 w-3 animate-spin" />
                                      <span>SENDING...</span>
                                    </span>
                                  ) : gradePostStatus === 'success' ? (
                                    <span className="text-emerald-400 font-bold">● SUCCESS (200 OK)</span>
                                  ) : gradePostStatus === 'error' ? (
                                    <span className="text-rose-400 font-bold">● FAILED</span>
                                  ) : (
                                    <span>IDLE</span>
                                  )}
                                  <button 
                                    type="button" 
                                    onClick={() => setGradePostLogs([])} 
                                    className="hover:text-slate-200 ml-2"
                                  >
                                    Clear Logs
                                  </button>
                                </div>
                              </div>
                              <div className="p-3 text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1 select-all scrollbar-thin">
                                {gradePostLogs.map((log, i) => {
                                  let color = 'text-slate-300';
                                  if (log.includes('SUCCESS')) color = 'text-emerald-400 font-bold';
                                  else if (log.includes('ERROR') || log.includes('failed')) color = 'text-rose-400 font-bold';
                                  else if (log.includes('Payload:')) color = 'text-amber-300';
                                  else if (log.includes('Response status code:')) color = 'text-cyan-300';
                                  return (
                                    <div key={i} className={`${color} whitespace-pre-wrap leading-relaxed`}>
                                      {log}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <form onSubmit={handleAddGrade} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                                Add New Grade Parameter & Send POST Request
                              </p>
                              <div className="text-[9px] text-indigo-600 bg-indigo-50 font-mono px-2 py-0.5 rounded font-semibold">
                                POST to /df/grade/add
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                Grade / Class Name (grade)
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Grade Name / Class Name"
                                value={newGradeName}
                                onChange={e => setNewGradeName(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>

                            <div className="bg-slate-900 text-slate-300 rounded-lg p-3 text-[10px] font-mono relative">
                              <span className="absolute top-2 right-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-1.5 py-0.5 rounded">
                                SCHEMA BODY PARAMETER
                              </span>
                              <pre className="text-emerald-400">
{`{
  "grade": "${newGradeName || 'Grade Name / Class Name'}"
}`}
                              </pre>
                            </div>

                            <div className="flex justify-end pt-1">
                              <button
                                type="submit"
                                disabled={isPostingGrade}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
                              >
                                {isPostingGrade ? (
                                  <>
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                    <span>Sending POST request...</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Add & Post Grade</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

    </div>
  );
}
