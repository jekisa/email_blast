module.exports = [
"[project]/app/dashboard/campaigns/manager.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CampaignManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const defaultSubject = 'Selamat ulang tahun, {{first_name}}!';
const defaultBody = 'Halo {{first_name}},\n\nSelamat ulang tahun! Semoga hari istimewa ini penuh kebahagiaan, kesehatan, dan momen indah.\n\nTerima kasih telah menjadi bagian dari Sanghyang. Kami berharap dapat menyambut Anda kembali.\n\nSalam hangat,\nTim Sanghyang';
const parse = async (response)=>{
    const data = await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(data.error ?? `Server gagal memuat data (${response.status}). Coba lagi atau hubungi admin teknis.`);
    return data;
};
const plainText = (html)=>html.replace(/<br\s*\/?\s*>/gi, '\n').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const statusLabel = (status)=>status === 'active' ? 'Aktif' : status === 'paused' ? 'Pause' : status === 'ended' ? 'Selesai' : 'Draft';
const scheduleLabel = (offset)=>offset === 0 ? 'H-0 · hari ulang tahun' : `H-${Math.abs(offset)} · ${Math.abs(offset)} hari sebelumnya`;
const versionLabel = (template)=>`${template.name?.trim() || 'Tanpa nama'} · Versi ${template.version}${template.isActive ? ' · aktif' : ''}`;
const json = (method, body)=>({
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
function CampaignManager() {
    const [campaigns, setCampaigns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [section, setSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('start');
    const [showCreate, setShowCreate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const data = await parse(await fetch('/api/admin/campaigns', {
            cache: 'no-store'
        }));
        setCampaigns(data.campaigns);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        refresh().catch((error)=>setMessage(error.message));
    }, [
        refresh
    ]);
    const drafts = campaigns.filter((campaign)=>campaign.status === 'draft');
    const running = campaigns.filter((campaign)=>campaign.status !== 'draft');
    const activeNames = (exceptId)=>campaigns.filter((campaign)=>campaign.status === 'active' && campaign.id !== exceptId).map((campaign)=>campaign.name);
    async function createCampaign(event) {
        event.preventDefault();
        setBusy(true);
        setMessage('');
        try {
            await parse(await fetch('/api/admin/campaigns', json('POST', {
                name
            })));
            await refresh();
            setShowCreate(false);
            setName('');
            setMessage('Draft dibuat dengan contoh ucapan dan kartu. Lengkapi lalu aktifkan dari kartunya.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Campaign gagal dibuat.');
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "manage-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "Campaign ulang tahun"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 43,
                        columnNumber: 48
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Siapkan ucapan sebagai draft, lalu aktifkan. Campaign aktif mengirim email otomatis pukul 00.00 WIB."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 43,
                        columnNumber: 77
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 43,
                columnNumber: 40
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "manage-message",
                role: "status",
                children: message
            }, void 0, false, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 44,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "campaign-nav",
                role: "tablist",
                "aria-label": "Bagian campaign",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "campaign-tab-create",
                        type: "button",
                        role: "tab",
                        "aria-selected": section === 'create',
                        "aria-controls": "campaign-panel-create",
                        onClick: ()=>setSection('create'),
                        children: [
                            "Buat Campaign (",
                            drafts.length,
                            " draft)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 46,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "campaign-tab-start",
                        type: "button",
                        role: "tab",
                        "aria-selected": section === 'start',
                        "aria-controls": "campaign-panel-start",
                        onClick: ()=>setSection('start'),
                        children: [
                            "Mulai Campaign (",
                            running.length,
                            " berjalan)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 47,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 45,
                columnNumber: 5
            }, this),
            section === 'create' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "campaign-panel-create",
                role: "tabpanel",
                "aria-labelledby": "campaign-tab-create",
                className: "campaign-section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "campaign-section-heading",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "eyebrow",
                                        children: "DRAFT"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                        lineNumber: 50,
                                        columnNumber: 54
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Buat Campaign"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                        lineNumber: 50,
                                        columnNumber: 92
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 50,
                                columnNumber: 49
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setShowCreate((open)=>!open),
                                "aria-expanded": showCreate,
                                children: showCreate ? 'Batal' : '+ Buat campaign baru'
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 50,
                                columnNumber: 120
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 50,
                        columnNumber: 7
                    }, this),
                    showCreate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        className: "manage-card create-form",
                        onSubmit: createCampaign,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Nama campaign",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: name,
                                        onChange: (event)=>setName(event.target.value),
                                        maxLength: 100,
                                        placeholder: "Contoh: Ucapan Ulang Tahun 2027",
                                        required: true,
                                        autoFocus: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                        lineNumber: 51,
                                        columnNumber: 110
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 51,
                                columnNumber: 90
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                disabled: busy,
                                children: busy ? 'Menyimpan...' : 'Simpan draft'
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 51,
                                columnNumber: 271
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 51,
                        columnNumber: 22
                    }, this),
                    drafts.map((campaign)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CampaignCard, {
                            campaign: campaign,
                            open: false,
                            activeNames: activeNames(campaign.id),
                            onRefresh: refresh,
                            onMessage: setMessage
                        }, campaign.id, false, {
                            fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                            lineNumber: 52,
                            columnNumber: 33
                        }, this)),
                    !drafts.length && !showCreate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "manage-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Belum ada draft."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 53,
                                columnNumber: 74
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Klik “+ Buat campaign baru” untuk menyiapkan ucapan baru."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 53,
                                columnNumber: 107
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 53,
                        columnNumber: 41
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 49,
                columnNumber: 30
            }, this),
            section === 'start' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "campaign-panel-start",
                role: "tabpanel",
                "aria-labelledby": "campaign-tab-start",
                className: "campaign-section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "campaign-section-heading",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "eyebrow",
                                        children: "BERJALAN"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                        lineNumber: 56,
                                        columnNumber: 54
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Mulai Campaign"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                        lineNumber: 56,
                                        columnNumber: 95
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 56,
                                columnNumber: 49
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Campaign aktif dan yang dijeda. Ubah status, jadwal, atau isi ucapan di sini."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 56,
                                columnNumber: 124
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 56,
                        columnNumber: 7
                    }, this),
                    running.map((campaign)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CampaignCard, {
                            campaign: campaign,
                            open: true,
                            activeNames: activeNames(campaign.id),
                            onRefresh: refresh,
                            onMessage: setMessage
                        }, campaign.id, false, {
                            fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                            lineNumber: 57,
                            columnNumber: 34
                        }, this)),
                    !running.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "manage-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Belum ada campaign yang berjalan."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 58,
                                columnNumber: 60
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Buka tab Buat Campaign, lalu ubah status draft menjadi Aktif."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 58,
                                columnNumber: 110
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 58,
                        columnNumber: 27
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 55,
                columnNumber: 29
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
        lineNumber: 43,
        columnNumber: 10
    }, this);
}
function CampaignCard({ campaign, open, activeNames, onRefresh, onMessage }) {
    const active = campaign.templates[0];
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(campaign.status);
    const [offset, setOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(campaign.sendOffsetDays);
    const [whatsappPhone, setWhatsappPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(campaign.whatsappPhone ?? '+628119011600');
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedVersion, setSelectedVersion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(active?.version ?? 0);
    const [versionName, setVersionName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(active?.name ?? '');
    const [subject, setSubject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(active?.subject?.trim() ? active.subject : defaultSubject);
    const [body, setBody] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(active?.bodyHtml?.trim() ? plainText(active.bodyHtml) : defaultBody);
    const [assetUrl, setAssetUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(campaign.assets[0]?.publicUrl ?? '/kartu-ucapan-ulang-tahun.jpeg');
    const [previewHtml, setPreviewHtml] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [previewMode, setPreviewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('desktop');
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [testing, setTesting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setStatus(campaign.status);
        setOffset(campaign.sendOffsetDays);
    }, [
        campaign.status,
        campaign.sendOffsetDays
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setWhatsappPhone(campaign.whatsappPhone ?? '+628119011600');
    }, [
        campaign.whatsappPhone
    ]);
    const loadHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const data = await parse(await fetch(`/api/admin/campaigns/${campaign.id}/templates`, {
            cache: 'no-store'
        }));
        setHistory(data.templates);
        return data.templates;
    }, [
        campaign.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadHistory().catch((error)=>onMessage(error.message));
    }, [
        loadHistory,
        onMessage
    ]);
    const selected = history.find((item)=>item.version === selectedVersion);
    async function run(action, success) {
        setSaving(true);
        onMessage('');
        try {
            await action();
            await onRefresh();
            onMessage(success);
        } catch (error) {
            onMessage(error instanceof Error ? error.message : 'Perubahan gagal disimpan.');
        } finally{
            setSaving(false);
        }
    }
    function selectVersion(version) {
        setSelectedVersion(version);
        const template = history.find((item)=>item.version === version);
        if (template) {
            setSubject(template.subject);
            setBody(plainText(template.bodyHtml));
            setVersionName(template.name ?? '');
        }
    }
    function saveSchedule() {
        const activating = status === 'active' && status !== campaign.status;
        const replacing = activating && activeNames.length > 0;
        if (activating && !window.confirm(replacing ? `${activeNames.join(', ')} sedang aktif. Kalau ${campaign.name} diaktifkan, ${activeNames.join(', ')} otomatis dijeda. Lanjutkan?` : `Aktifkan ${campaign.name}? Email akan dikirim otomatis ke customer yang berulang tahun.`)) return;
        return saveScheduleChanges(replacing);
    }
    const saveScheduleChanges = (replacing)=>run(async ()=>{
            const changes = {};
            if (status !== campaign.status) changes.status = status;
            if (replacing) changes.replaceActive = true;
            if (offset !== campaign.sendOffsetDays) changes.sendOffsetDays = offset;
            await parse(await fetch(`/api/admin/campaigns/${campaign.id}`, json('PATCH', changes)));
            if (changes.status === 'active') await parse(await fetch('/api/admin/dispatches/preview', json('POST', {
                campaignId: campaign.id
            })));
        }, status === 'paused' && status !== campaign.status ? 'Campaign dijeda. Email yang belum dikirim ditahan.' : replacing ? `${campaign.name} aktif. ${activeNames.join(', ')} dijeda.` : 'Status dan jadwal tersimpan.');
    const saveWhatsAppPhone = ()=>run(async ()=>{
            const data = await parse(await fetch(`/api/admin/campaigns/${campaign.id}`, json('PATCH', {
                whatsappPhone
            })));
            setWhatsappPhone(data.campaign.whatsappPhone ?? '');
        }, 'Nomor WhatsApp tersimpan.');
    const saveNewVersion = ()=>run(async ()=>{
            const result = await parse(await fetch(`/api/admin/campaigns/${campaign.id}/templates`, json('POST', {
                subject,
                body,
                name: versionName
            })));
            await loadHistory();
            setSelectedVersion(result.template.version);
        }, 'Versi baru tersimpan dan langsung dipakai.');
    const renameVersion = ()=>run(async ()=>{
            await parse(await fetch(`/api/admin/campaigns/${campaign.id}/templates?version=${selectedVersion}`, json('PATCH', {
                name: versionName
            })));
            await loadHistory();
        }, 'Nama versi tersimpan.');
    const useVersion = ()=>run(async ()=>{
            await parse(await fetch(`/api/admin/campaigns/${campaign.id}/templates?version=${selectedVersion}`, json('PATCH', {
                isActive: true
            })));
            await loadHistory();
        }, `Versi ${selectedVersion} sekarang dipakai untuk email.`);
    async function deleteVersion() {
        if (!selectedVersion || !window.confirm(`Hapus versi ${selectedVersion}?`)) return;
        await run(async ()=>{
            await parse(await fetch(`/api/admin/campaigns/${campaign.id}/templates?version=${selectedVersion}`, {
                method: 'DELETE'
            }));
            const templates = await loadHistory();
            const current = templates.find((item)=>item.isActive);
            setSelectedVersion(current?.version ?? 0);
            setVersionName(current?.name ?? '');
            setSubject(current?.subject ?? defaultSubject);
            setBody(current ? plainText(current.bodyHtml) : defaultBody);
        }, 'Versi dihapus.');
    }
    async function upload(file) {
        if (!file) return;
        const form = new FormData();
        form.set('file', file);
        form.set('campaignId', campaign.id);
        form.set('altText', 'Kartu ucapan ulang tahun Sanghyang');
        await run(async ()=>{
            const result = await parse(await fetch('/api/admin/assets', {
                method: 'POST',
                body: form
            }));
            setAssetUrl(result.asset.publicUrl);
        }, 'Kartu ucapan tersimpan.');
    }
    const preview = ()=>run(async ()=>{
            const data = await parse(await fetch(`/api/admin/campaigns/${campaign.id}/preview`, json('POST', {
                subject,
                body
            })));
            setPreviewHtml(data.html);
        }, 'Pratinjau diperbarui. Email tidak dikirim.');
    async function sendTest() {
        setTesting(true);
        onMessage('');
        try {
            const data = await parse(await fetch('/api/admin/email/test', {
                method: 'POST'
            }));
            onMessage(`Email tes diterima server SMTP untuk ${data.recipient}. Periksa inbox dan folder spam.`);
        } catch (error) {
            onMessage(error instanceof Error ? error.message : 'Email tes gagal dikirim.');
        } finally{
            setTesting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
        className: "manage-card campaign-card",
        open: open,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "campaign-card-title",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: campaign.name
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 145,
                                columnNumber: 52
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: [
                                    scheduleLabel(campaign.sendOffsetDays),
                                    " · pukul 00.00 WIB"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 145,
                                columnNumber: 84
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 145,
                        columnNumber: 14
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `campaign-state ${campaign.status}`,
                        children: statusLabel(campaign.status)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 145,
                        columnNumber: 164
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 145,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "Status dan jadwal"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 147,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "campaign-start-controls",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Status",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: status,
                                onChange: (event)=>setStatus(event.target.value),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "draft",
                                        children: "Draft"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                        lineNumber: 149,
                                        columnNumber: 95
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "active",
                                        children: "Aktif"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                        lineNumber: 149,
                                        columnNumber: 131
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "paused",
                                        children: "Pause"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                        lineNumber: 149,
                                        columnNumber: 168
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 149,
                                columnNumber: 20
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 149,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Kirim",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: offset,
                                onChange: (event)=>setOffset(Number(event.target.value)),
                                children: Array.from({
                                    length: 8
                                }, (_, days)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: -days,
                                        children: scheduleLabel(-days)
                                    }, days, false, {
                                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                        lineNumber: 150,
                                        columnNumber: 142
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 150,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 150,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: saveSchedule,
                        disabled: saving || status === campaign.status && offset === campaign.sendOffsetDays,
                        children: saving ? 'Menyimpan...' : 'Simpan'
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 151,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 148,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "manage-hint",
                children: "Email selalu dikirim mulai pukul 00.00 WIB. Default H-0, tepat di hari ulang tahun."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 153,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "WhatsApp"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 155,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                children: [
                    "Nomor WhatsApp",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "tel",
                        value: whatsappPhone,
                        onChange: (e)=>setWhatsappPhone(e.target.value),
                        maxLength: 16,
                        placeholder: "+628119011600"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 156,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 156,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "manage-hint",
                children: "Tombol “Claim Your Birthday Treats” di email langsung membuka chat ke nomor ini. Format internasional, contoh +628119011600."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 157,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: saveWhatsAppPhone,
                disabled: saving || whatsappPhone === (campaign.whatsappPhone ?? ''),
                children: "Simpan nomor"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 158,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "Ucapan"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 160,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "campaign-version-row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Versi tersimpan",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: selectedVersion,
                                onChange: (e)=>selectVersion(Number(e.target.value)),
                                children: [
                                    !history.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 0,
                                        children: "Belum ada versi"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                        lineNumber: 162,
                                        columnNumber: 137
                                    }, this),
                                    history.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: item.version,
                                            children: versionLabel(item)
                                        }, item.id, false, {
                                            fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                            lineNumber: 162,
                                            columnNumber: 203
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 162,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 162,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "outline-button",
                        onClick: useVersion,
                        disabled: saving || !selected || selected.isActive,
                        children: "Pakai versi ini"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 163,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "outline-button",
                        onClick: deleteVersion,
                        disabled: saving || !selectedVersion,
                        children: "Hapus versi"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 164,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 161,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "manage-hint",
                children: "Memilih versi hanya memuat teksnya ke editor. Klik “Pakai versi ini” agar email memakai versi tersebut."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 166,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                children: [
                    "Nama versi",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: versionName,
                        onChange: (e)=>setVersionName(e.target.value),
                        maxLength: 60,
                        placeholder: "Contoh: Ucapan Oktober"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 167,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 167,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                children: [
                    "Subjek",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: subject,
                        onChange: (e)=>setSubject(e.target.value),
                        maxLength: 180
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 168,
                        columnNumber: 18
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 168,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                children: [
                    "Isi ucapan",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        rows: 7,
                        value: body,
                        onChange: (e)=>setBody(e.target.value),
                        maxLength: 6000
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 169,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 169,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "manage-hint",
                children: [
                    '{{first_name}}',
                    " otomatis diganti nama depan penerima."
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 170,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "editor-footer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: saveNewVersion,
                        disabled: saving,
                        children: "Simpan sebagai versi baru"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 171,
                        columnNumber: 36
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "outline-button",
                        onClick: renameVersion,
                        disabled: saving || !selected || (selected.name ?? '') === versionName.trim(),
                        children: "Simpan nama versi"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 171,
                        columnNumber: 121
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 171,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "Kartu ulang tahun"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 173,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "upload-label",
                children: [
                    "Ganti foto (JPEG, PNG, atau WebP, maks. 5 MB)",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "file",
                        accept: "image/jpeg,image/png,image/webp",
                        onChange: (e)=>upload(e.target.files?.[0]).catch((error)=>onMessage(error.message))
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 174,
                        columnNumber: 82
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 174,
                columnNumber: 5
            }, this),
            assetUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                className: "asset-thumb",
                src: assetUrl,
                alt: "Pratinjau kartu ulang tahun"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 175,
                columnNumber: 18
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "editor-footer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: preview,
                        disabled: saving || testing,
                        children: "Pratinjau email"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 177,
                        columnNumber: 36
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "outline-button",
                        onClick: sendTest,
                        disabled: saving || testing,
                        children: testing ? 'Mengirim email tes...' : 'Kirim email tes'
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 177,
                        columnNumber: 115
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Hanya ke alamat penerima tes yang dikonfigurasi di server."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 177,
                        columnNumber: 262
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 177,
                columnNumber: 5
            }, this),
            previewHtml && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "email-preview",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "editor-footer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Pratinjau email"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 178,
                                columnNumber: 87
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "outline-button",
                                onClick: ()=>setPreviewMode('desktop'),
                                "aria-pressed": previewMode === 'desktop',
                                children: "Desktop"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 178,
                                columnNumber: 119
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "outline-button",
                                onClick: ()=>setPreviewMode('mobile'),
                                "aria-pressed": previewMode === 'mobile',
                                children: "Mobile"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                                lineNumber: 178,
                                columnNumber: 253
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 178,
                        columnNumber: 56
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                        title: "Pratinjau email ulang tahun",
                        sandbox: "allow-popups allow-popups-to-escape-sandbox",
                        srcDoc: previewHtml,
                        style: {
                            display: 'block',
                            width: previewMode === 'mobile' ? '390px' : '100%',
                            maxWidth: '100%',
                            height: '620px',
                            margin: '12px auto',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            background: '#fff'
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                        lineNumber: 178,
                        columnNumber: 390
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/campaigns/manager.tsx",
                lineNumber: 178,
                columnNumber: 21
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/campaigns/manager.tsx",
        lineNumber: 144,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=app_dashboard_campaigns_manager_tsx_19-xi6tc3bq03._.js.map