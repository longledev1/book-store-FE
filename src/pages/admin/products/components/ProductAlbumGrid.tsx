import React from "react";
import { Trash2, Star, Sparkles, FolderHeart } from "lucide-react";
import { type Media } from "../../../../services/media.service";
import { resolveMediaUrl } from "../../../../utils/format";

interface AlbumGridItem {
  mediaId: string;
  displayOrder: number;
  media: Media;
}

interface ProductAlbumGridProps {
  albums: AlbumGridItem[];
  onRemoveAlbum: (mediaId: string) => void;
  onSetMainAlbum: (mediaId: string) => void;
  onMoveOrder: (index: number, direction: "up" | "down") => void;
}

export default function ProductAlbumGrid({
  albums,
  onRemoveAlbum,
  onSetMainAlbum,
  onMoveOrder,
}: ProductAlbumGridProps) {
  if (albums.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-2 text-center select-none bg-slate-50/50">
        <div className="w-10 h-10 rounded-2xl bg-blue-50/50 flex items-center justify-center text-blue-500">
          <FolderHeart className="w-5 h-5 stroke-[1.5]" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-black text-slate-700 uppercase tracking-tight">Chưa có ảnh sản phẩm</p>
          <p className="text-[10px] text-slate-400 font-bold max-w-[320px]">
            Sản phẩm bắt buộc phải có ít nhất 1 ảnh chính để hiển thị trên website. Hãy bấm nút Chọn ảnh từ Media để thiết lập.
          </p>
        </div>
      </div>
    );
  }

  // Sort local albums copy based on displayOrder (main displayOrder=1 first, then order > 1, hidden order=0 last)
  const sortedAlbums = [...albums].sort((a, b) => {
    if (a.displayOrder === 0) return 1;
    if (b.displayOrder === 0) return -1;
    return a.displayOrder - b.displayOrder;
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {sortedAlbums.map((item, index) => {
        const isMain = item.displayOrder === 1;
        const isHidden = item.displayOrder === 0;

        return (
          <div
            key={item.mediaId}
            className={`group bg-white rounded-2xl border transition-all overflow-hidden flex flex-col relative ${
              isMain
                ? "border-primary ring-4 ring-primary/5"
                : isHidden
                ? "border-slate-100 opacity-50"
                : "border-slate-200/60"
            }`}
          >
            {/* Image display */}
            <div className="aspect-square w-full bg-slate-50 flex items-center justify-center relative border-b border-slate-100">
              <img
                src={resolveMediaUrl(item.media.fileUrl)}
                alt={item.media.altText || item.media.fileName}
                className="w-full h-full object-cover"
              />

              {/* Status Badges */}
              {isMain && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  <span>Ảnh chính</span>
                </div>
              )}

              {isHidden && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-500 text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                  Ẩn / Không hiển thị
                </div>
              )}

              {!isMain && !isHidden && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/65 backdrop-blur-[2px] text-white text-[9px] font-black rounded-lg">
                  Album #{item.displayOrder}
                </div>
              )}

              {/* Hover Delete Action Button */}
              <button
                type="button"
                onClick={() => onRemoveAlbum(item.mediaId)}
                className="absolute right-2 top-2 p-1.5 bg-white hover:bg-rose-50 text-slate-450 hover:text-rose-600 rounded-xl shadow border border-slate-100 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Xóa khỏi album"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Info details / operations */}
            <div className="p-3 flex flex-col gap-2 justify-center bg-white min-h-[74px]">
              <span className="text-[10px] font-bold text-slate-700 truncate block" title={item.media.fileName}>
                {item.media.fileName}
              </span>

              <div className="flex items-center gap-1.5 select-none w-full">
                {/* Set main button */}
                {!isMain && (
                  <button
                    type="button"
                    onClick={() => onSetMainAlbum(item.mediaId)}
                    className="flex-grow py-1 px-2 border border-slate-200 hover:border-primary hover:text-primary rounded-lg text-[9px] font-extrabold text-slate-550 transition-colors cursor-pointer"
                  >
                    Đặt ảnh chính
                  </button>
                )}

                {/* Move order buttons (only for sub-albums) */}
                {!isMain && !isHidden && (
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      type="button"
                      disabled={index <= 1} // index 0 is Main, index 1 is first sub album
                      onClick={() => onMoveOrder(index, "up")}
                      className="w-5 h-5 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                      title="Chuyển lên"
                    >
                      {"<"}
                    </button>
                    <button
                      type="button"
                      disabled={index === sortedAlbums.length - 1 || sortedAlbums[index + 1].displayOrder === 0}
                      onClick={() => onMoveOrder(index, "down")}
                      className="w-5 h-5 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                      title="Chuyển xuống"
                    >
                      {">"}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
