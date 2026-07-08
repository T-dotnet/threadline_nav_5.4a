import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { FileText, Folder, Camera, Activity, LucideIcon } from 'lucide-react';

export interface DocFile {
  typeId: string;
  typeName: string;
  name: string;
  date: string;
  uploadedBy: "you" | "threadline";
  shared: boolean;
  sharedWith?: string;
  icon: LucideIcon;
  childName?: string;
  childId?: string;
}

const INITIAL_FILES: DocFile[] = [
  {
    typeId: "report",
    typeName: "Report",
    name: "Actionable Clarity Report",
    date: "8 Jun 2026",
    uploadedBy: "threadline",
    shared: false,
    icon: FileText,
    childName: "Maya",
    childId: "child-maya",
  },
  {
    typeId: "schoolpack",
    typeName: "School Pack",
    name: "School Clarity Pack",
    date: "8 Jun 2026",
    uploadedBy: "threadline",
    shared: true,
    sharedWith: "Homeroom Teacher",
    icon: Folder,
    childName: "Maya",
    childId: "child-maya",
  },
  {
    typeId: "school",
    typeName: "School",
    name: "Teacher Meeting Preparation Notes",
    date: "10 Jun 2026",
    uploadedBy: "you",
    shared: false,
    icon: Camera,
    childName: "Liam",
    childId: "child-liam",
  },
  {
    typeId: "clinical",
    typeName: "Clinical",
    name: "Parent Observations Log — Sleep Prep",
    date: "12 Jun 2026",
    uploadedBy: "you",
    shared: true,
    sharedWith: "Clinical reviewer",
    icon: Activity,
    childName: "Noah",
    childId: "child-noah",
  },
  {
    typeId: "report",
    typeName: "Report",
    name: "Clinician Returned Assessment Results",
    date: "10 Jul 2026",
    uploadedBy: "threadline",
    shared: true,
    sharedWith: "Family",
    icon: FileText,
    childName: "Ruby",
    childId: "child-ruby",
  },
  {
    typeId: "school",
    typeName: "School",
    name: "Chloe Teacher Questionnaire",
    date: "3 Jul 2026",
    uploadedBy: "you",
    shared: true,
    sharedWith: "Clinical reviewer",
    icon: FileText,
    childName: "Chloe",
    childId: "child-chloe",
  },
  {
    typeId: "report",
    typeName: "Report",
    name: "Progress Review — Early Baseline",
    date: "15 Jun 2026",
    uploadedBy: "threadline",
    shared: false,
    icon: FileText,
    childName: "Liam",
    childId: "child-liam",
  },
];

interface LockerContextType {
  files: DocFile[];
  search: string;
  filter: string;
  setSearch: (s: string) => void;
  setFilter: (f: string) => void;
  toggleShare: (index: number) => void;
  filteredFiles: DocFile[];
  addFile: (file: DocFile) => void;
}

const LockerContext = createContext<LockerContextType | undefined>(undefined);

export function LockerProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<DocFile[]>(INITIAL_FILES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const addFile = useCallback((file: DocFile) => {
    setFiles((prev) => [file, ...prev]);
  }, []);

  const toggleShare = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const file = { ...newFiles[index] };
      if (file.shared) {
        file.shared = false;
        file.sharedWith = undefined;
      } else {
        file.shared = true;
        file.sharedWith = "your care circle";
      }
      newFiles[index] = file;
      return newFiles;
    });
  }, []);

  const handleSetSearch = useCallback((s: string) => {
    setSearch(s);
  }, []);

  const handleSetFilter = useCallback((f: string) => {
    setFilter(f);
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all" ||
        f.typeId === filter ||
        (filter === "uploaded-you" && f.uploadedBy === "you") ||
        (filter === "uploaded-threadline" && f.uploadedBy === "threadline");
      return matchSearch && matchFilter;
    });
  }, [files, search, filter]);

  const value = useMemo(() => ({
    files,
    search,
    filter,
    setSearch: handleSetSearch,
    setFilter: handleSetFilter,
    toggleShare,
    filteredFiles,
    addFile
  }), [files, search, filter, handleSetSearch, handleSetFilter, toggleShare, filteredFiles, addFile]);

  return (
    <LockerContext.Provider value={value}>
      {children}
    </LockerContext.Provider>
  );
}

export function useLocker() {
  const context = useContext(LockerContext);
  if (context === undefined) {
    throw new Error('useLocker must be used within a LockerProvider');
  }
  return context;
}
