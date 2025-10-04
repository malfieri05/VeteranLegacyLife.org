# Domain Swap Plan: .com to .org

## Current Status
- **Working commit:** cd1ede0 (with fallback funnel button)
- **Backup created:** ../VETFUNNEL-BACKUP-20241004-112400
- **Current domain:** veteranlegacylife.org (Vercel deployment)

## Build Process Analysis
1. **React App:** `funnel-app/` directory with Vite build system
2. **Build command:** `npm run build` creates `dist/` folder
3. **Asset deployment:** Copy `dist/*` to root and `production/` folders
4. **Asset references:** HTML references specific JS/CSS files by hash

## Current Asset References in index.html
- CSS: `assets/index-0b8ff63a.css`
- JS: `assets/index-307ab848.js` (main funnel)
- Additional: `assets/index-e3aadf94.js`, `assets/index-f3d073f2.css`

## Implementation Plan

### Phase 1: ✅ COMPLETED - Preparation
- [x] Full project backup created
- [x] Build process documented
- [x] Current asset references identified

### Phase 2: Low-Risk Changes (Static Files)
**Files to change:**
1. `sitemap.xml` - 3 instances
2. `robots.txt` - 1 instance  
3. `mobile.html` - 8 instances
4. `funnel-app/google_scripts/*.gs` - 5 instances

**Risk:** LOW - No impact on React app
**Action:** Simple find/replace, test each change

### Phase 3: React App Config Changes (CRITICAL)
**Files to change:**
1. `funnel-app/src/config/globalConfig.ts` - 1 instance
2. `funnel-app/src/config/emailConfig.ts` - 2 instances

**Risk:** HIGH - Requires full rebuild
**Action:** 
1. Change config files
2. `cd funnel-app && npm run build`
3. Copy new `dist/*` to root and `production/`
4. Update HTML asset references to new file names
5. Test thoroughly

### Phase 4: Final Verification
- [ ] Desktop site loads
- [ ] Mobile site loads  
- [ ] Funnel button works
- [ ] Google Tag tracking works
- [ ] All forms submit correctly
- [ ] No broken links

## Rollback Plan
If anything goes wrong:
```bash
git reset --hard cd1ede0
git push --force vll-origin main
```

## Key Safeguards
1. **Incremental deployment** - Test each phase
2. **Asset verification** - Always check new JS/CSS files exist
3. **Quick rollback** - Keep working commit ready
4. **No simultaneous changes** - One phase at a time

## Next Steps
Ready to proceed with Phase 2 (Low-Risk Changes)
