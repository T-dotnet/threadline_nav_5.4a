import { motion } from "motion/react";
import { Plus, Trash2, X, ShieldCheck, ShieldHalf } from "lucide-react";
import { Child, Page } from "../types";
import { cn } from "../lib/utils";
import { useState } from "react";
import { getChildReviewDate, getChildSubheading } from "../lib/childStatus";
import { getListRowCornerClass } from "../lib/cornerStyles";
import { DEMO_PARENT_NICKNAME, DEMO_WORKSPACE_EMAIL } from "../lib/demoWorkspace";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Switch } from "./ui/Switch";
import { Avatar } from "./ui/Avatar";
import { IconButton } from "./ui/IconButton";
import { ModalCloseButton, ModalShell } from "./ui/ModalShell";
import { PageHeader } from "./ui/PageHeader";
import { SurfacePanel } from "./ui/SurfacePanel";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import {
  useSecondaryUsers,
  SECONDARY_USER_ROLES,
  AccessLevel,
} from "../context/SecondaryUsersContext";

interface SettingsPageProps {
  onPageChange: (page: Page) => void;
  onAddChildRequest: () => void;
}

export default function SettingsPage({
  onAddChildRequest,
}: SettingsPageProps) {
  const { currentChild, childrenList, deleteChild } = useCurrentChild();
  const [nickname, setNickname] = useState(DEMO_PARENT_NICKNAME);
  const [email, setEmail] = useState(DEMO_WORKSPACE_EMAIL);
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [pendingDeleteChild, setPendingDeleteChild] = useState<Child | null>(null);

  // Secondary user access (partner, teacher, carer, etc.) — persisted via context.
  const {
    secondaryUsers,
    addSecondaryUser,
    removeSecondaryUser,
    setSecondaryUserAccess,
  } = useSecondaryUsers();
  const secondaryRoles = SECONDARY_USER_ROLES;
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState(secondaryRoles[0]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserAccess, setNewUserAccess] = useState<AccessLevel>("full");

  const resetNewUserForm = () => {
    setNewUserName("");
    setNewUserRole(secondaryRoles[0]);
    setNewUserEmail("");
    setNewUserAccess("full");
    setShowAddUser(false);
  };

  const handleAddSecondaryUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    addSecondaryUser({
      name: newUserName.trim(),
      role: newUserRole,
      email: newUserEmail.trim(),
      access: newUserAccess,
    });
    resetNewUserForm();
  };

  const handleRemoveSecondaryUser = (id: string) => {
    removeSecondaryUser(id);
  };

  const getNextReview = (child: Child) => {
    if (child.isNew) return getChildSubheading(child);
    return getChildReviewDate(child);
  };

  const handleDeleteChildConfirm = () => {
    if (!pendingDeleteChild?.id) return;
    deleteChild(pendingDeleteChild.id);
    setPendingDeleteChild(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pt-16 pb-24"
    >
      <PageContainer>
        <PageHeader
          kicker="Account & Workspace Configs"
          title="Settings"
          description="Manage active profiles, family access settings, clinical workspace credentials, and UI configurations."
        />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 mb-16 border-b border-black/10 pb-16">
        <div>
          <h2 className="text-[1.1rem] font-medium text-slate-900 tracking-tight">
            Parent Metadata
          </h2>
          <p className="text-[0.9rem] text-slate-500 mt-2 leading-relaxed">
            Update your contact details and how you'd like to be addressed in
            the application.
          </p>
        </div>
        <SurfacePanel>
          <div className="mb-6">
            <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
              Primary Parent Nickname
            </label>
            <Input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="mb-8" id="notification-settings-section">
            <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
              Contact Notification Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <div className="flex items-center justify-between py-2 border-t border-black/5 mt-6 mb-2">
              <span className="text-[0.85rem] text-slate-700 font-medium">
                Receive email notifications
              </span>
              <Switch
                checked={receiveNotifications}
                onCheckedChange={setReceiveNotifications}
              />
            </div>

          </div>
          <Button variant="primary">
            Save Parent Profile
          </Button>
        </SurfacePanel>
      </div>

      <div className="flex flex-col">
      <div className="order-2 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 mt-16 border-t border-black/10 pt-16">
        <div>
          <h2 className="text-[1.1rem] font-medium text-slate-900 tracking-tight">
            Registered Children Profiles
          </h2>
          <p className="text-[0.9rem] text-slate-500 mt-2 leading-relaxed">
            Manage the children in your workspace. Switch between active
            profiles to view their specific timelines and resources.
          </p>
        </div>
        <div>
          <Button
            variant="tertiary"
            onClick={onAddChildRequest}
            className="mb-6"
            leftIcon={<Plus className="w-4 h-4 stroke-[2]" />}
          >
            Add new child profile
          </Button>

          <div className="space-y-4">
            {childrenList.map((child, i) => {
              const isActive = currentChild.id && child.id ? currentChild.id === child.id : currentChild.name === child.name;
              const cornerClass = getListRowCornerClass(i);

              return (
                <div
                  key={`${child.name}-${i}`}
                  className={cn(
                    "bg-white p-6 transition-all flex items-center justify-between gap-6",
                    isActive
                      ? "thread-profile-card--active"
                      : "shadow-premium-light hover:shadow-md",
                    cornerClass,
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Avatar
                      size="lg"
                      fallback={child.initial}
                      className="bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] font-serif text-[1.2rem]"
                    />
                    <div>
                      <h3 className="font-medium text-[1.1rem] text-slate-900 tracking-tight">
                        {child.name}
                      </h3>
                      <p className="text-[0.84rem] text-slate-500 mt-0.5">
                        {getChildSubheading(child)}
                        {!child.isNew && ` · Next Review on ${getNextReview(child)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => setPendingDeleteChild(child)}
                      className="h-11 w-11 px-0 py-0"
                      aria-label={`Delete ${child.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary Users & Access Section */}
      <div className="order-1 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 mt-16 border-t border-black/10 pt-16">
        <div>
          <h2 className="text-[1.1rem] font-medium text-slate-900 tracking-tight">
            Secondary Users & Access
          </h2>
          <p className="text-[0.9rem] text-slate-500 mt-2 leading-relaxed">
            Invite a partner, teacher, or carer into this workspace and choose how
            much they can see. <span className="font-medium text-slate-700">Full access</span> mirrors your own view;
            <span className="font-medium text-slate-700"> partial access</span> shares only selected areas
            (configurable soon).
          </p>
        </div>
        <div>
          {!showAddUser ? (
            <Button
              variant="tertiary"
              onClick={() => setShowAddUser(true)}
              className="mb-6"
              leftIcon={<Plus className="w-4 h-4 stroke-[2]" />}
            >
              Add secondary user
            </Button>
          ) : (
            <SurfacePanel className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-[1.05rem] text-slate-900 tracking-tight">
                  Invite secondary user
                </h3>
                <IconButton
                  type="button"
                  onClick={resetNewUserForm}
                  className="h-8 w-8 border-0 bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Cancel"
                >
                  <X className="w-4 h-4" />
                </IconButton>
              </div>

              <div className="mb-5">
                <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
                  Full name
                </label>
                <Input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder={`e.g. ${secondaryUsers[0]?.name ?? "Alex Morgan"}`}
                />
              </div>

              <div className="mb-5">
                <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
                  Role
                </label>
                <div className="flex flex-wrap gap-2">
                  {secondaryRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewUserRole(role)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[0.82rem] font-medium border transition-colors min-h-[40px]",
                        newUserRole === role
                          ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/40 text-[var(--style-light-surface-text)]"
                          : "border-black/10 text-slate-600 hover:border-black/20 bg-white"
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
                  Invitation email
                </label>
                <Input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <div className="mb-7">
                <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-3 block">
                  Access level
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setNewUserAccess("full")}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-2xl border text-left transition-all min-h-[64px]",
                      newUserAccess === "full"
                        ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 ring-2 ring-[var(--color-thread-mid-green)]/10"
                        : "border-black/5 hover:border-black/15 bg-slate-50/40 hover:bg-slate-50/90"
                    )}
                  >
                    <ShieldCheck className="w-5 h-5 text-[var(--color-thread-mid-green)] shrink-0 mt-0.5" />
                    <span className="flex flex-col">
                      <span className="font-medium text-[0.95rem] text-slate-900">Full access</span>
                      <span className="text-[0.74rem] text-slate-500 mt-0.5">Sees and manages everything you can</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUserAccess("partial")}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-2xl border text-left transition-all min-h-[64px]",
                      newUserAccess === "partial"
                        ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 ring-2 ring-[var(--color-thread-mid-green)]/10"
                        : "border-black/5 hover:border-black/15 bg-slate-50/40 hover:bg-slate-50/90"
                    )}
                  >
                    <ShieldHalf className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="flex flex-col">
                      <span className="font-medium text-[0.95rem] text-slate-900 flex items-center gap-2">
                        Partial access
                      </span>
                      <span className="text-[0.74rem] text-slate-500 mt-0.5">Limited scope — configurable soon</span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="primary" onClick={handleAddSecondaryUser}>
                  Send invitation
                </Button>
                <Button variant="tertiary" onClick={resetNewUserForm}>
                  Cancel
                </Button>
              </div>
            </SurfacePanel>
          )}

          <div className="space-y-4">
            {secondaryUsers.length === 0 ? (
              <p className="text-[0.86rem] text-slate-400 italic">
                No secondary users yet. Invite a partner, teacher, or carer to share access.
              </p>
            ) : (
              secondaryUsers.map((user, i) => {
                const cornerClass = getListRowCornerClass(i);
                const initials = user.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={user.id}
                    className={cn(
                      "bg-white p-6 shadow-premium-light hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5",
                      cornerClass
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        size="lg"
                        fallback={initials}
                        className="bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] font-serif text-[1rem]"
                      />
                      <div>
                        <h3 className="font-medium text-[1.1rem] text-slate-900 tracking-tight">
                          {user.name}
                        </h3>
                        <p className="text-[0.84rem] text-slate-500 mt-0.5">
                          {user.role} · {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex bg-slate-100 rounded-xl p-1 border border-black/5">
                        <button
                          type="button"
                          onClick={() => setSecondaryUserAccess(user.id, "full")}
                          className={cn(
                            "px-3.5 py-2 text-[0.78rem] font-medium rounded-lg transition-all min-h-[40px]",
                            user.access === "full"
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-900"
                          )}
                        >
                          Full
                        </button>
                        <button
                          type="button"
                          onClick={() => setSecondaryUserAccess(user.id, "partial")}
                          className={cn(
                            "px-3.5 py-2 text-[0.78rem] font-medium rounded-lg transition-all min-h-[40px] inline-flex items-center gap-1.5",
                            user.access === "partial"
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-900"
                          )}
                        >
                          Partial
                        </button>
                      </div>
                      <Button
                        variant="danger"
                        type="button"
                        onClick={() => handleRemoveSecondaryUser(user.id)}
                        className="h-11 w-11 px-0 py-0"
                        aria-label={`Remove ${user.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      </div>

      </PageContainer>
      <ModalShell
        isOpen={pendingDeleteChild !== null}
        titleId="delete-child-profile-modal-title"
        size="small"
        radiusClassName="rounded-tr-[28px] rounded-bl-[28px]"
        panelClassName="relative p-7"
      >
        <ModalCloseButton
          onClick={() => setPendingDeleteChild(null)}
          label="Close delete child profile confirmation"
        />
        <span className="block text-[0.66rem] font-medium uppercase tracking-[0.16em] text-rose-600">
          Delete profile
        </span>
        <h2
          id="delete-child-profile-modal-title"
          className="mt-3 font-serif text-[1.8rem] leading-tight tracking-tight text-[var(--color-thread-heading)]"
        >
          Delete {pendingDeleteChild?.name}&apos;s profile?
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          This removes the child profile from Registered Children Profiles. This action cannot be undone.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="tertiary"
            onClick={() => setPendingDeleteChild(null)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="dangerSolid"
            onClick={handleDeleteChildConfirm}
            disabled={!pendingDeleteChild?.id}
          >
            Delete profile
          </Button>
        </div>
      </ModalShell>
    </motion.div>
  );
}
