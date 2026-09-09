import React, { useState, useEffect } from "react";
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  HardDrive,
} from "lucide-react";
import { type MediaFolder } from "../../../../services/media.service";

export interface FolderNode {
  name: string;
  path: string;
  fileCount: number;
  children: FolderNode[];
}

interface MediaFolderPanelProps {
  folders: MediaFolder[];
  selectedFolder: string;
  onSelectFolder: (path: string) => void;
}

export default function MediaFolderPanel({
  folders,
  selectedFolder,
  onSelectFolder,
}: MediaFolderPanelProps) {
  const [folderTree, setFolderTree] = useState<FolderNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({
    products: true, // Expand Products folder by default
  });

  // Build folder tree whenever folders prop changes
  useEffect(() => {
    const rootPaths = [
      "general",
      "products",
      "categories",
      "avatars",
      "banners",
      "events",
      "authors",
    ];
    const treeMap: Record<string, FolderNode> = {};

    const ensureNode = (path: string): FolderNode => {
      if (treeMap[path]) return treeMap[path];

      const parts = path.split("/");
      const name = parts[parts.length - 1];

      let formattedName = name;
      if (path === "general") formattedName = "General";
      else if (path === "products") formattedName = "Products";
      else if (path === "categories") formattedName = "Categories";
      else if (path === "avatars") formattedName = "Avatars";
      else if (path === "banners") formattedName = "Banners";
      else if (path === "events") formattedName = "Events";
      else {
        // Format subfolders nicely
        formattedName = name
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }

      const newNode: FolderNode = {
        name: formattedName,
        path: path,
        fileCount: 0,
        children: [],
      };

      treeMap[path] = newNode;

      if (parts.length > 1) {
        const parentPath = parts.slice(0, -1).join("/");
        const parentNode = ensureNode(parentPath);
        // Avoid duplicate children
        if (!parentNode.children.some((child) => child.path === path)) {
          parentNode.children.push(newNode);
        }
      }

      return newNode;
    };

    rootPaths.forEach(ensureNode);

    folders.forEach((f) => {
      const node = ensureNode(f.folderPath);
      node.fileCount = f.totalFiles;
    });

    const calculateCumulative = (node: FolderNode): number => {
      let sum = node.fileCount;
      node.children.forEach((child) => {
        sum += calculateCumulative(child);
      });
      node.fileCount = sum;
      return sum;
    };

    const roots = rootPaths.map((p) => treeMap[p]);
    roots.forEach(calculateCumulative);

    setFolderTree(roots);
  }, [folders]);

  const toggleExpand = (path: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting folder when clicking expand arrow
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderFolderNode = (node: FolderNode, depth = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = !!expandedFolders[node.path];
    const isSelected = selectedFolder === node.path;

    return (
      <div key={node.path} className="space-y-1">
        <div
          onClick={() => onSelectFolder(node.path)}
          className={`group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all select-none ${
            isSelected
              ? "bg-primary text-white shadow-sm shadow-blue-500/10"
              : "text-slate-650 hover:bg-slate-100/80 hover:text-slate-800"
          }`}
          style={{ paddingLeft: `${Math.max(12, depth * 16)}px` }}
        >
          <div className="flex items-center gap-2 truncate">
            {hasChildren && (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.path, e)}
                className={`rounded p-0.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
                  isSelected
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                )}
              </button>
            )}
            {!hasChildren && depth > 0 && <div className="w-4.5" />}{" "}
            {/* alignment spacer */}
            {isSelected ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-white" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-blue-500/80" />
            )}
            <span className="truncate">{node.name}</span>
          </div>
          {node.fileCount > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-black select-none ${
                isSelected
                  ? "bg-white/20 text-white"
                  : "text-slate-450 bg-slate-100"
              }`}
            >
              {node.fileCount}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="relative ml-1.5 space-y-1 before:absolute before:top-0 before:bottom-2 before:left-[19px] before:w-0.5 before:bg-slate-100">
            {node.children.map((child) => renderFolderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const totalFilesCount = folders.reduce((sum, f) => sum + f.totalFiles, 0);

  return (
    <div className="flex w-full shrink-0 flex-col gap-4 rounded-3xl border border-slate-200/50 bg-white p-4 shadow-sm md:w-60">
      {/* Title */}
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <HardDrive className="h-4 w-4 text-slate-400" />
        <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          Thư mục lưu trữ
        </span>
      </div>

      {/* Folders navigation list */}
      <div className="max-h-[60vh] scrollbar-thin space-y-1 overflow-y-auto md:max-h-none">
        {/* All files option */}
        <div
          onClick={() => onSelectFolder("")}
          className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all select-none ${
            selectedFolder === ""
              ? "bg-primary text-white shadow-sm shadow-blue-500/10"
              : "text-slate-650 hover:bg-slate-100/80 hover:text-slate-800"
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <FolderOpen
              className={`h-4 w-4 shrink-0 ${selectedFolder === "" ? "text-white" : "text-blue-500"}`}
            />
            <span>Tất cả</span>
          </div>
          {totalFilesCount > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                selectedFolder === ""
                  ? "bg-white/20 text-white"
                  : "text-slate-450 bg-slate-100"
              }`}
            >
              {totalFilesCount}
            </span>
          )}
        </div>

        {/* Dynamic trees */}
        {folderTree.map((node) => renderFolderNode(node))}
      </div>
    </div>
  );
}
