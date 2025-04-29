"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronDown,
  Plus,
  Mail,
  // ArrowRight,
  Settings,
  LogOut,
  User,
  MoreHorizontal,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/client";
import { SettingsModal } from "./settings-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { getChatHistory, deleteChat } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatHistoryItem {
  id: string;
  title: string;
}

function capitalizeFirstLetter(string: string | null): string {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Define SocialLink at the top level
const SocialLink = ({
  icon: Icon,
  text,
  href,
}: {
  icon: React.ElementType;
  text: string;
  href: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 text-sm text-stone-700 hover:text-stone-900 transition-colors"
  >
    <Icon className="h-4 w-4 text-stone-500" />
    <span>{text}</span>
  </a>
);

export interface SidebarProps {
  className?: string;
  onToggleCollapse?: () => void;
  collapsed?: boolean;
  isAuthenticated: boolean;
  activePlanName: string | null;
  isSubscriptionLoading: boolean;
}

export function SidebarComponent({
  className,
  onToggleCollapse,
  collapsed = false,
  isAuthenticated,
  activePlanName,
}: SidebarProps) {
  const [isWorkspaceCollapsed, setIsWorkspaceCollapsed] = useState(false);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // --- State for Chat History ---
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // --- State for Delete Confirmation ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<ChatHistoryItem | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const profileButton = document.querySelector(".profile-button");
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        !(profileButton && profileButton.contains(event.target as Node))
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- useEffect to fetch chat history ---
  useEffect(() => {
    console.log("[Sidebar Effect] Running due to auth/path change:", {
      isAuthenticated,
      pathname,
    });
    if (isAuthenticated) {
      setIsLoadingHistory(true);
      setHistoryError(null);
      getChatHistory()
        .then((history) => {
          console.log("[Sidebar Effect] Fetched history:", history);
          setChatHistory(history);
        })
        .catch((error) => {
          console.error("Sidebar fetch history error:", error);
          setHistoryError("Failed to load history.");
        })
        .finally(() => {
          setIsLoadingHistory(false);
        });
    } else {
      console.log("[Sidebar Effect] Clearing history due to !isAuthenticated");
      setChatHistory([]);
      setIsLoadingHistory(false);
    }
  }, [isAuthenticated, pathname]);

  const handleCollapseClick = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  const toggleWorkspace = () => setIsWorkspaceCollapsed(!isWorkspaceCollapsed);
  const toggleHistory = () => setIsHistoryCollapsed(!isHistoryCollapsed);

  const handleSignOut = async () => {
    const client = createSupabaseClient();
    await client.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  const linkd = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      fill="#a8a8a8"
      stroke="#a8a8a8"
      height="200px"
      width="200px"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45.959 45.959"
      {...props}
    >
      <path
        d="M5.392,0.492C2.268,0.492,0,2.647,0,5.614c0,2.966,2.223,5.119,5.284,5.119c1.588,0,2.956-0.515,3.957-1.489 
    c0.96-0.935,1.489-2.224,1.488-3.653C10.659,2.589,8.464,0.492,5.392,0.492z M7.847,7.811C7.227,8.414,6.34,8.733,5.284,8.733 
    C3.351,8.733,2,7.451,2,5.614c0-1.867,1.363-3.122,3.392-3.122c1.983,0,3.293,1.235,3.338,3.123 
    C8.729,6.477,8.416,7.256,7.847,7.811z"
      />
      <path d="M0.959,45.467h8.988V12.422H0.959V45.467z M2.959,14.422h4.988v29.044H2.959V14.422z" />
      <path
        d="M33.648,12.422c-4.168,0-6.72,1.439-8.198,2.792l-0.281-2.792H15v33.044h9.959V28.099
    c0-0.748,0.303-2.301,0.493-2.711c1.203-2.591,2.826-2.591,5.284-2.591c2.831,0,5.223,2.655,5.223,5.797v16.874h10v-18.67
    C45.959,16.92,39.577,12.422,33.648,12.422z M43.959,43.467h-6V28.593c0-4.227-3.308-7.797-7.223-7.797
    c-2.512,0-5.358,0-7.099,3.75c-0.359,0.775-0.679,2.632-0.679,3.553v15.368H17V14.422h6.36l0.408,4.044h1.639l0.293-0.473
    c0.667-1.074,2.776-3.572,7.948-3.572c4.966,0,10.311,3.872,10.311,12.374V43.467z"
      />
    </svg>
  );

  // --- Define the callback for settings changes ---
  const handleSettingsChanged = () => {
    console.log("[Sidebar] Settings changed, refreshing router...");
    router.refresh();
  };

  const handleDeleteChat = async () => {
    if (!chatToDelete || isDeleting) return;

    const deletedChatId = chatToDelete.id;
    setIsDeleting(true);
    setIsDeleteModalOpen(false);

    try {
      const result = await deleteChat(deletedChatId);
      if (result.success) {
        setChatHistory((prevHistory) =>
          prevHistory.filter((chat) => chat.id !== deletedChatId)
        );

        if (pathname === `/c/${deletedChatId}`) {
          router.push("/");
        }
      } else {
        console.error("Failed to delete chat:", result.error);
        // TODO: Show error toast to user
      }
    } catch (error) {
      console.error("Error calling deleteChat:", error);
      // TODO: Show error toast
    } finally {
      setIsDeleting(false);
      setChatToDelete(null);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col h-full border-r border-stone-200 bg-stone-50 transition-all duration-300 ease-in-out",
        collapsed ? "w-0" : "w-[260px]",
        className
      )}
      style={
        {
          "--sidebar-mask":
            "linear-gradient(to right, black calc(100% - 80px), transparent calc(100% - 20px))",
        } as React.CSSProperties
      }
    >
      {!collapsed && (
        <>
          <div className="flex items-center justify-between p-4 flex-shrink-0">
            <div className="flex items-center h-[26px]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "8px" }}
              >
                <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H18L22 22V4C22 2.9 21.1 2 20 2Z"
                  fill="currentColor"
                />
              </svg>
              <span
                className="font-bold text-2xl text-zinc-900"
                style={{ lineHeight: "26px", marginTop: "-3px" }}
              >
                SIJ AI
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full transition-all duration-300 ease-in-out hover:bg-stone-200"
              onClick={handleCollapseClick}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-3 py-2 flex-shrink-0">
            <Button
              variant="ghost"
              className="w-full text-stone-700 hover:bg-stone-200 px-1.5"
              onClick={() => router.push("/")}
            >
              <div className="flex items-center gap-2 w-full">
                <Plus className="h-4 w-4" />
                <span>New project</span>
              </div>
            </Button>
          </div>

          <Separator className="bg-stone-200" />

          <div className="flex-1 overflow-y-auto px-3 py-2">
            <div className="mb-2">
              <button
                className="flex items-center justify-between w-full px-1.5 py-1.5 text-sm font-bold text-stone-700 rounded-md"
                onClick={toggleWorkspace}
              >
                <span className="text-left">Workspace</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform text-stone-500",
                    isWorkspaceCollapsed ? "-rotate-90" : ""
                  )}
                />
              </button>
              {!isWorkspaceCollapsed && (
                <div className="mt-1 space-y-1 animate-in fade-in duration-200">
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-stone-700 hover:bg-stone-200 text-sm px-1.5"
                    onClick={() => router.push("/context")}
                  >
                    <div className="flex items-center gap-2 w-full text-left">
                      <span>📖</span> <span>Context</span>
                    </div>
                  </Button>
                </div>
              )}
            </div>

            <Separator className="bg-stone-200 my-3" />

            <div className="mb-2">
              <button
                className="flex items-center justify-between w-full px-1.5 py-1.5 text-sm font-bold text-stone-700 rounded-md"
                onClick={toggleHistory}
              >
                <span className="text-left">History</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform text-stone-500",
                    isHistoryCollapsed ? "-rotate-90" : ""
                  )}
                />
              </button>
              {!isHistoryCollapsed && (
                <div className="mt-1 space-y-1 animate-in fade-in duration-200 w-full overflow-hidden">
                  {/* Loading State */}
                  {isLoadingHistory && (
                    <>
                      <Skeleton className="h-8 w-full rounded-lg" />
                      <Skeleton className="h-8 w-full rounded-lg" />
                    </>
                  )}
                  {/* Error State */}
                  {!isLoadingHistory && historyError && (
                    <p className="px-1.5 py-2 text-sm text-red-600">
                      {historyError}
                    </p>
                  )}
                  {/* Empty State */}
                  {!isLoadingHistory &&
                    !historyError &&
                    chatHistory.length === 0 && (
                      <p className="px-1.5 py-2 text-sm text-stone-500">
                        No chat history yet.
                      </p>
                    )}
                  {/* History List */}
                  {!isLoadingHistory &&
                    !historyError &&
                    chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        className="group relative flex items-center w-full overflow-hidden min-w-0"
                      >
                        <Button
                          variant="ghost"
                          className="justify-start text-stone-700 hover:bg-stone-200 text-sm px-1.5 py-2 h-auto flex-grow mr-1 min-w-0"
                          onClick={() => router.push(`/c/${chat.id}`)}
                          disabled={isDeleting && chatToDelete?.id === chat.id}
                        >
                          <div
                            className="relative grow overflow-hidden whitespace-nowrap text-left min-w-0"
                            style={{ maskImage: "var(--sidebar-mask)" }}
                          >
                            {isDeleting && chatToDelete?.id === chat.id
                              ? "Deleting..."
                              : chat.title}
                          </div>
                        </Button>
                        {/* Three Dot Menu Button - Opens Modal */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0 flex-shrink-0 text-stone-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatToDelete(chat);
                            setIsDeleteModalOpen(true);
                          }}
                          disabled={isDeleting && chatToDelete?.id === chat.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Conditionally render Upgrade section based on loading state */}
          {/* {isAuthenticated && !isSubscriptionLoading && !activePlanName && (
            <>
              <Separator className="bg-stone-200"/>
              <div className="px-3 py-2 flex flex-col gap-y-1 flex-shrink-0">
                <Button 
                  variant="outline"
                  className="w-full justify-start gap-2 border-stone-200 text-stone-700 hover:bg-stone-200"
                  onClick={() => router.push('/pricing')}
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Upgrade Plan</span>
                </Button>
              </div>
            </>
          )} */}

          {/* Social Feedback Section (Separator is now only rendered once) */}
          <Separator className="bg-stone-200" />
          <div className="px-5 py-4">
            <h3 className="text-sm font-medium text-stone-800 mb-3">
              Feedback? DM us!
            </h3>
            <div className="space-y-2.5">
              <SocialLink
                icon={linkd}
                text="@shahidulJahid"
                href="https://www.linkedin.com/in/shahiduljahid71/"
              />
              <SocialLink
                icon={Mail}
                text="Contact us"
                href="mailto:shahiduljahid71@gmail.com"
              />
            </div>
          </div>

          {/* Profile Section (Moved here) */}
          <div className="p-3 border-t border-stone-200">
            <div className="relative">
              <button
                className="w-full h-10 bg-stone-50 text-stone-900 hover:bg-stone-200 rounded-lg flex items-center px-4 shadow-none profile-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(!showProfileMenu);
                }}
              >
                <div className="flex items-center gap-2 grow">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span>Profile</span>
                  {/* Use PROP for tag */}
                  <span className="text-xs px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded-full">
                    {activePlanName
                      ? capitalizeFirstLetter(activePlanName)
                      : "Free"}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform flex-shrink-0 ml-2",
                    showProfileMenu ? "rotate-180" : ""
                  )}
                />
              </button>

              {showProfileMenu && (
                <div
                  ref={profileMenuRef}
                  className="absolute bottom-full left-0 w-full bg-white rounded-lg shadow-lg border border-stone-200 py-1 mb-1"
                >
                  <button
                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-stone-100 text-stone-700"
                    onClick={() => {
                      setIsSettingsModalOpen(true);
                      setShowProfileMenu(false); // Close profile menu when opening modal
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <Separator className="my-1" />
                  <button
                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-stone-100 text-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        setIsOpen={setIsSettingsModalOpen}
        onSettingsChanged={handleSettingsChanged}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        itemTitle={chatToDelete?.title ?? null}
        onConfirmDelete={handleDeleteChat}
        isDeleting={isDeleting}
      />
    </div>
  );
}
