import React, { useState } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import { type Media } from "../../../../services/media.service";
import ProductAlbumGrid from "./ProductAlbumGrid";
import MediaPickerModal from "./MediaPickerModal";

interface AlbumGridItem {
  mediaId: string;
  displayOrder: number;
  media: Media;
}

interface ProductAlbumManagerProps {
  albums: AlbumGridItem[];
  onChangeAlbums: (newAlbums: AlbumGridItem[]) => void;
}

export default function ProductAlbumManager({
  albums,
  onChangeAlbums,
}: ProductAlbumManagerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleOpenPicker = () => {
    setIsPickerOpen(true);
  };

  const handleSelectMedias = (selectedMedias: Media[]) => {
    // Determine initial displayOrder
    let nextOrder = albums.length === 0 ? 1 : Math.max(...albums.map((a) => a.displayOrder)) + 1;
    if (nextOrder < 1) nextOrder = 1;

    const newItems: AlbumGridItem[] = selectedMedias.map((media, index) => {
      const order = albums.length === 0 && index === 0 ? 1 : nextOrder + index;
      return {
        mediaId: media.id,
        displayOrder: order,
        media: media,
      };
    });

    onChangeAlbums([...albums, ...newItems]);
  };

  const handleRemoveAlbum = (mediaId: string) => {
    const updated = albums.filter((a) => a.mediaId !== mediaId);
    
    // Clean up display orders so there's always one main image if list is not empty
    if (updated.length > 0) {
      const hasMain = updated.some((a) => a.displayOrder === 1);
      if (!hasMain) {
        // Promote first element to main image
        const sorted = [...updated].sort((a, b) => {
          if (a.displayOrder === 0) return 1;
          if (b.displayOrder === 0) return -1;
          return a.displayOrder - b.displayOrder;
        });
        sorted[0].displayOrder = 1;
        
        // Renumber other sub-albums
        let subIndex = 2;
        sorted.forEach((item) => {
          if (item.displayOrder > 1) {
            item.displayOrder = subIndex++;
          }
        });
        onChangeAlbums(sorted);
        return;
      }
      
      // Renumber orders smoothly
      const mainIndex = updated.findIndex((a) => a.displayOrder === 1);
      let orderIndex = 2;
      const remapped = updated.map((item, idx) => {
        if (idx === mainIndex) return item;
        if (item.displayOrder === 0) return item;
        return {
          ...item,
          displayOrder: orderIndex++,
        };
      });
      onChangeAlbums(remapped);
    } else {
      onChangeAlbums([]);
    }
  };

  const handleSetMainAlbum = (mediaId: string) => {
    const updated = albums.map((item) => {
      if (item.mediaId === mediaId) {
        return { ...item, displayOrder: 1 };
      }
      if (item.displayOrder === 1) {
        // Demote previous main to first sub album order
        return { ...item, displayOrder: 2 };
      }
      return item;
    });

    // Remap remaining orders smoothly
    const mainItem = updated.find((a) => a.displayOrder === 1)!;
    const others = updated
      .filter((a) => a.mediaId !== mainItem.mediaId)
      .sort((a, b) => {
        if (a.displayOrder === 0) return 1;
        if (b.displayOrder === 0) return -1;
        return a.displayOrder - b.displayOrder;
      });

    let indexOrder = 2;
    const finalRemap = [
      mainItem,
      ...others.map((item) => {
        if (item.displayOrder === 0) return item;
        return { ...item, displayOrder: indexOrder++ };
      }),
    ];

    onChangeAlbums(finalRemap);
  };

  const handleMoveOrder = (index: number, direction: "up" | "down") => {
    const sorted = [...albums].sort((a, b) => {
      if (a.displayOrder === 0) return 1;
      if (b.displayOrder === 0) return -1;
      return a.displayOrder - b.displayOrder;
    });

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    
    // Swap items displayOrder
    const tempOrder = sorted[index].displayOrder;
    sorted[index].displayOrder = sorted[targetIdx].displayOrder;
    sorted[targetIdx].displayOrder = tempOrder;

    onChangeAlbums(sorted);
  };

  const alreadySelectedIds = albums.map((a) => a.mediaId);

  return (
    <div className="space-y-3.5 bg-slate-50/40 border border-slate-200/50 p-6 rounded-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
            Ảnh sản phẩm
          </label>
          <p className="text-[10px] text-slate-400 font-medium pl-1 select-none">
            Chọn ảnh đại diện chính và các ảnh album đính kèm cho sản phẩm từ thư viện Media.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenPicker}
          className="px-4 py-2 border border-primary hover:bg-primary/5 text-primary text-xs font-black rounded-xl active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Chọn ảnh từ Media</span>
        </button>
      </div>

      {/* Grid gallery */}
      <ProductAlbumGrid
        albums={albums}
        onRemoveAlbum={handleRemoveAlbum}
        onSetMainAlbum={handleSetMainAlbum}
        onMoveOrder={handleMoveOrder}
      />

      {/* Picker dialog modal */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleSelectMedias}
        alreadySelectedMediaIds={alreadySelectedIds}
      />
    </div>
  );
}
