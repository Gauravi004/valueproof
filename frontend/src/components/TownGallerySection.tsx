import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { MapPin, ChevronRight, Sparkles } from 'lucide-react';

interface GalleryConfigItem {
  id: string;
  townKey: string;
  titleKey: string;
  descKey: string;
  area: string;
  road: string;
  imageUrl: string;
  tagKey: string;
}

const GALLERY_DATA: GalleryConfigItem[] = [
  {
    id: '1',
    townKey: 'meerut',
    titleKey: 'gallery_items.meerut_title',
    descKey: 'gallery_items.meerut_desc',
    area: '250 Gaj (2,250 sq.ft)',
    road: '30 ft Sector Road',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80',
    tagKey: 'intake.property_types.house',
  },
  {
    id: '2',
    townKey: 'alwar',
    titleKey: 'gallery_items.alwar_title',
    descKey: 'gallery_items.alwar_desc',
    area: '200 Gaj (1,800 sq.ft)',
    road: '40 ft Sector Main',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    tagKey: 'intake.property_types.plot',
  },
  {
    id: '3',
    townKey: 'jhansi',
    titleKey: 'gallery_items.jhansi_title',
    descKey: 'gallery_items.jhansi_desc',
    area: '450 sq.ft Retail',
    road: 'Sadar Bazar Road',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    tagKey: 'intake.property_types.shop',
  },
  {
    id: '4',
    townKey: 'karnal',
    titleKey: 'gallery_items.karnal_title',
    descKey: 'gallery_items.karnal_desc',
    area: '3 BHK (1,650 sq.ft)',
    road: '40 ft Gated Entry',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    tagKey: 'intake.property_types.apartment',
  },
];

export const TownGallerySection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryConfigItem | null>(null);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-cream-300 shadow-warm space-y-6 my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-700" />
            <span>{t('gallery.badge')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            {t('gallery.heading')}
          </h3>
          <p className="text-xs text-slate-600">
            {t('gallery.subheading')}
          </p>
        </div>

        <span className="text-xs font-bold text-brand-800 bg-cream-100 px-3 py-1.5 rounded-full border border-cream-300 self-start sm:self-auto">
          {t('gallery.verified_photos')}
        </span>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GALLERY_DATA.map((item) => {
          const localizedTown = t(`towns.${item.townKey}`);
          const localizedTitle = t(item.titleKey);
          const localizedDesc = t(item.descKey);
          const localizedTag = t(item.tagKey);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group cursor-pointer rounded-2xl border-2 border-cream-300 overflow-hidden bg-white hover:border-brand-600 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Image Container with Zoom & Badge */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={localizedTitle}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-2.5 left-2.5 bg-brand-950/90 text-cream-100 font-bold text-[10px] px-2.5 py-0.5 rounded-md border border-brand-700 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-saffron-400" />
                  <span>{localizedTown}</span>
                </div>

                <div className="absolute top-2.5 right-2.5 bg-saffron-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md shadow">
                  {localizedTag}
                </div>

                <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                  <div className="text-xs font-black line-clamp-1">{localizedTitle}</div>
                  <div className="text-[10px] text-cream-200">{item.area}</div>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-3 bg-cream-50/60 space-y-1.5 flex-1 flex flex-col justify-between">
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {localizedDesc}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-cream-200 text-[10px]">
                  <span className="font-bold text-brand-900">🛣️ {item.road}</span>
                  <span className="text-brand-700 font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
                    {t('gallery.view')} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-brand-800 max-w-lg w-full overflow-hidden shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="relative h-64 w-full">
              <img
                src={selectedPhoto.imageUrl}
                alt={t(selectedPhoto.titleKey)}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white font-black flex items-center justify-center hover:bg-black cursor-pointer"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 bg-brand-900/90 text-white text-xs px-3 py-1 rounded-xl font-bold border border-brand-700">
                📍 {t(`towns.${selectedPhoto.townKey}`)}
              </div>
            </div>

            <div className="p-6 pt-0 space-y-3">
              <div>
                <h4 className="text-lg font-black text-slate-900">{t(selectedPhoto.titleKey)}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{t(selectedPhoto.descKey)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-cream-50 p-3 rounded-2xl border border-cream-300">
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold">{t('gallery.area_spec')}</span>
                  <span className="font-black text-slate-900">{selectedPhoto.area}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold">{t('gallery.road_access')}</span>
                  <span className="font-black text-brand-900">{selectedPhoto.road}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="w-full py-3 rounded-xl bg-brand-900 hover:bg-brand-950 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                {t('gallery.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
