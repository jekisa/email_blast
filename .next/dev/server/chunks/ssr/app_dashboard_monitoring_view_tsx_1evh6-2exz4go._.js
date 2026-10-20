module.exports = [
"[project]/app/dashboard/monitoring/view.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Monitoring
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const labels = {
    scheduled: 'Terjadwal',
    queued: 'Antrean',
    processing: 'Sedang diproses',
    accepted: 'Diterima SMTP',
    rejected: 'Gagal',
    error: 'Gagal',
    cancelled: 'Dibatalkan'
};
const jakarta = (date, options)=>new Intl.DateTimeFormat('id-ID', {
        ...options,
        timeZone: 'Asia/Jakarta'
    }).format(date);
const monthKeyNow = ()=>{
    const parts = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        timeZone: 'Asia/Jakarta'
    }).formatToParts(new Date());
    return `${parts.find((part)=>part.type === 'year')?.value}-${parts.find((part)=>part.type === 'month')?.value}`;
};
const dateKey = (date)=>new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Jakarta'
    }).format(date);
const dateLabel = (value)=>value ? jakarta(new Date(value), {
        dateStyle: 'medium',
        timeStyle: 'short'
    }) : '—';
function Monitoring() {
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [clickedCustomerCount, setClickedCustomerCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [whatsappClickedCustomerCount, setWhatsappClickedCustomerCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [month, setMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(monthKeyNow);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('Memuat monitoring...');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let active = true;
        setMessage('Memuat monitoring...');
        setLoading(true);
        fetch(`/api/admin/dispatches?month=${month}`, {
            cache: 'no-store'
        }).then(async (response)=>{
            const data = await response.json();
            if (!response.ok) throw new Error(data.error ?? 'Monitoring gagal dimuat.');
            if (!active) return;
            const nextRows = data.monthlyDispatches;
            setRows(nextRows);
            setClickedCustomerCount(data.clickedCustomerCount);
            setWhatsappClickedCustomerCount(data.whatsappClickedCustomerCount);
            setSelectedDate((previous)=>nextRows.some((row)=>dateKey(new Date(row.scheduledAt)) === previous) ? previous : nextRows[0] ? dateKey(new Date(nextRows[0].scheduledAt)) : `${month}-01`);
            setMessage(nextRows.length ? '' : 'Belum ada jadwal ulang tahun untuk bulan ini.');
        }).catch((error)=>{
            if (active) setMessage(error instanceof Error ? error.message : 'Monitoring gagal dimuat.');
        }).finally(()=>{
            if (active) setLoading(false);
        });
        return ()=>{
            active = false;
        };
    }, [
        month
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setPage(0), [
        selectedDate
    ]);
    const [year, monthNumber] = month.split('-').map(Number);
    const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
    const firstWeekday = (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7;
    const groupedRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const grouped = new Map();
        for (const row of rows){
            const key = dateKey(new Date(row.scheduledAt));
            grouped.set(key, [
                ...grouped.get(key) ?? [],
                row
            ]);
        }
        return grouped;
    }, [
        rows
    ]);
    const selectedRows = groupedRows.get(selectedDate) ?? [];
    const pageSize = 25;
    const pageCount = Math.ceil(selectedRows.length / pageSize);
    const visibleRows = selectedRows.slice(page * pageSize, (page + 1) * pageSize);
    const monthDate = new Date(Date.UTC(year, monthNumber - 1, 15, 12));
    const monthLabel = jakarta(monthDate, {
        month: 'long',
        year: 'numeric'
    });
    function shiftMonth(amount) {
        const shifted = new Date(Date.UTC(year, monthNumber - 1 + amount, 1));
        setMonth(`${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, '0')}`);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "manage-page",
        children: [
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-loading-bar",
                role: "progressbar",
                "aria-label": "Memuat data monitoring"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                lineNumber: 84,
                columnNumber: 52
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "Monitoring email"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                        lineNumber: 84,
                        columnNumber: 152
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Kalender menampilkan jumlah customer yang akan dikirimi email per tanggal kirim, beserta status pengiriman yang tercatat. Diterima SMTP berarti server menerima pesan, bukan bukti email masuk inbox."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                        lineNumber: 84,
                        columnNumber: 177
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                lineNumber: 84,
                columnNumber: 144
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "monitoring-click-summary",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "manage-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "manage-card-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "eyebrow",
                                                children: "TAUTAN SANGHYANG"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                lineNumber: 85,
                                                columnNumber: 122
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: [
                                                    "Klik ",
                                                    monthLabel
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                lineNumber: 85,
                                                columnNumber: 171
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 85,
                                        columnNumber: 117
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "count-pill",
                                        children: clickedCustomerCount
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 85,
                                        columnNumber: 203
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 85,
                                columnNumber: 80
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Pelanggan unik yang mengeklik tautan Sanghyang. Pemindai keamanan email juga dapat tercatat."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 85,
                                columnNumber: 267
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                        lineNumber: 85,
                        columnNumber: 47
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "manage-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "manage-card-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "eyebrow",
                                                children: "WHATSAPP"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                lineNumber: 85,
                                                columnNumber: 451
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: [
                                                    "Klik ",
                                                    monthLabel
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                lineNumber: 85,
                                                columnNumber: 492
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 85,
                                        columnNumber: 446
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "count-pill",
                                        children: whatsappClickedCustomerCount
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 85,
                                        columnNumber: 524
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 85,
                                columnNumber: 409
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Pelanggan unik yang mengeklik tombol WhatsApp. Ini tidak memastikan pesan dikirim."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 85,
                                columnNumber: 596
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                        lineNumber: 85,
                        columnNumber: 376
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                lineNumber: 85,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: `manage-card birthday-calendar-section${loading ? ' is-loading' : ''}`,
                "aria-busy": loading,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "manage-card-heading",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "eyebrow",
                                        children: "JADWAL PENGIRIMAN"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 87,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Kalender ulang tahun"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 87,
                                        columnNumber: 99
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 87,
                                columnNumber: 44
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "calendar-month-controls",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "outline-button",
                                        "aria-label": "Bulan sebelumnya",
                                        onClick: ()=>shiftMonth(-1),
                                        children: "Sebelumnya"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 87,
                                        columnNumber: 175
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: monthLabel
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 87,
                                        columnNumber: 304
                                    }, this),
                                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "loading-label",
                                        "aria-hidden": "true",
                                        children: "Memuat…"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 87,
                                        columnNumber: 345
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "outline-button",
                                        "aria-label": "Bulan berikutnya",
                                        onClick: ()=>shiftMonth(1),
                                        children: "Berikutnya"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 87,
                                        columnNumber: 411
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 87,
                                columnNumber: 134
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                        lineNumber: 87,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "birthday-calendar",
                        role: "grid",
                        "aria-label": `Kalender ulang tahun ${monthLabel}`,
                        children: [
                            [
                                'Sen',
                                'Sel',
                                'Rab',
                                'Kam',
                                'Jum',
                                'Sab',
                                'Min'
                            ].map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "calendar-weekday",
                                    role: "columnheader",
                                    children: day
                                }, day, false, {
                                    fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                    lineNumber: 89,
                                    columnNumber: 73
                                }, this)),
                            Array.from({
                                length: firstWeekday
                            }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "calendar-empty",
                                    role: "gridcell"
                                }, `empty-${index}`, false, {
                                    fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                    lineNumber: 90,
                                    columnNumber: 61
                                }, this)),
                            Array.from({
                                length: daysInMonth
                            }, (_, index)=>{
                                const day = index + 1;
                                const key = `${month}-${String(day).padStart(2, '0')}`;
                                const dayRows = groupedRows.get(key) ?? [];
                                const accepted = dayRows.filter((row)=>row.status === 'accepted').length;
                                const failed = dayRows.filter((row)=>[
                                        'rejected',
                                        'error'
                                    ].includes(row.status)).length;
                                const upcoming = dayRows.filter((row)=>[
                                        'scheduled',
                                        'queued',
                                        'processing'
                                    ].includes(row.status)).length;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    role: "gridcell",
                                    "aria-pressed": selectedDate === key,
                                    "aria-label": `${day} ${monthLabel}: ${dayRows.length} customer, ${upcoming} akan dikirim, ${accepted} diterima SMTP, ${failed} gagal`,
                                    className: `calendar-day${selectedDate === key ? ' selected' : ''}${dayRows.length ? ' has-birthdays' : ''}`,
                                    onClick: ()=>setSelectedDate(key),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "calendar-day-number",
                                            children: day
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                            lineNumber: 99,
                                            columnNumber: 13
                                        }, this),
                                        dayRows.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "calendar-day-count",
                                                    children: [
                                                        dayRows.length,
                                                        " customer"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                    lineNumber: 99,
                                                    columnNumber: 88
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "calendar-day-status",
                                                    children: upcoming === dayRows.length ? `${upcoming} akan dikirim` : `${accepted} diterima · ${failed} gagal${upcoming ? ` · ${upcoming} antre` : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                    lineNumber: 99,
                                                    columnNumber: 157
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                            lineNumber: 99,
                                            columnNumber: 86
                                        }, this)
                                    ]
                                }, key, true, {
                                    fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                    lineNumber: 98,
                                    columnNumber: 18
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                        lineNumber: 88,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "calendar-legend",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "calendar-dot scheduled"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 103,
                                        columnNumber: 46
                                    }, this),
                                    "Antrean"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 103,
                                columnNumber: 40
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "calendar-dot accepted"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 103,
                                        columnNumber: 106
                                    }, this),
                                    "Diterima SMTP"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 103,
                                columnNumber: 100
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "calendar-dot failed"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 103,
                                        columnNumber: 171
                                    }, this),
                                    "Gagal"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 103,
                                columnNumber: 165
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                        lineNumber: 103,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                lineNumber: 86,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "manage-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "manage-card-heading",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "eyebrow",
                                        children: selectedDate ? jakarta(new Date(`${selectedDate}T12:00:00+07:00`), {
                                            dateStyle: 'full'
                                        }) : 'DETAIL TANGGAL'
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 105,
                                        columnNumber: 80
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Daftar penerima"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 105,
                                        columnNumber: 223
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 105,
                                columnNumber: 75
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "count-pill",
                                children: selectedRows.length
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 105,
                                columnNumber: 253
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                        lineNumber: 105,
                        columnNumber: 38
                    }, this),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        role: "status",
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                        lineNumber: 106,
                        columnNumber: 19
                    }, this),
                    !message && selectedRows.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Tidak ada customer yang ulang tahun pada tanggal ini."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                        lineNumber: 107,
                        columnNumber: 49
                    }, this),
                    selectedRows.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "table-scroll",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Kontak"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 85
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Campaign"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 100
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Jadwal WIB"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 117
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Status pengiriman"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 136
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Klik Sanghyang"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 162
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Klik WhatsApp"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 185
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                lineNumber: 108,
                                                columnNumber: 81
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                            lineNumber: 108,
                                            columnNumber: 74
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: visibleRows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                row.customer.fullName || row.customer.email,
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                    className: "table-detail",
                                                                    children: row.customer.email
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                                    lineNumber: 108,
                                                                    columnNumber: 319
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                            lineNumber: 108,
                                                            columnNumber: 270
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: row.campaign.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                            lineNumber: 108,
                                                            columnNumber: 384
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: dateLabel(row.scheduledAt)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                            lineNumber: 108,
                                                            columnNumber: 412
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: labels[row.status] ?? row.status
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                                    lineNumber: 108,
                                                                    columnNumber: 453
                                                                }, this),
                                                                row.acceptedAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                    className: "table-detail",
                                                                    children: [
                                                                        "Diterima SMTP · ",
                                                                        dateLabel(row.acceptedAt)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                                    lineNumber: 108,
                                                                    columnNumber: 523
                                                                }, this),
                                                                row.errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                    className: "table-detail",
                                                                    children: row.errorMessage
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                                    lineNumber: 108,
                                                                    columnNumber: 628
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                            lineNumber: 108,
                                                            columnNumber: 449
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: row.clickedAt ? `Diklik · ${dateLabel(row.clickedAt)}` : row.status === 'accepted' ? 'Belum diklik' : '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                            lineNumber: 108,
                                                            columnNumber: 692
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: !row.campaign.whatsappConfigured ? 'Tidak diatur' : row.whatsappClickedAt ? `Diklik · ${dateLabel(row.whatsappClickedAt)}` : row.status === 'accepted' ? 'Belum diklik' : '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                            lineNumber: 108,
                                                            columnNumber: 808
                                                        }, this)
                                                    ]
                                                }, row.id, true, {
                                                    fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 253
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                            lineNumber: 108,
                                            columnNumber: 220
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                    lineNumber: 108,
                                    columnNumber: 67
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 108,
                                columnNumber: 37
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "recipient-pagination",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Menampilkan ",
                                            page * pageSize + 1,
                                            "–",
                                            Math.min((page + 1) * pageSize, selectedRows.length),
                                            " dari ",
                                            selectedRows.length,
                                            " penerima"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 108,
                                        columnNumber: 1059
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "outline-button",
                                        disabled: page === 0,
                                        onClick: ()=>setPage((current)=>current - 1),
                                        children: "Sebelumnya"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 108,
                                        columnNumber: 1196
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Halaman ",
                                            page + 1,
                                            " dari ",
                                            pageCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 108,
                                        columnNumber: 1336
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "outline-button",
                                        disabled: page + 1 >= pageCount,
                                        onClick: ()=>setPage((current)=>current + 1),
                                        children: "Berikutnya"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                        lineNumber: 108,
                                        columnNumber: 1384
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                                lineNumber: 108,
                                columnNumber: 1021
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/monitoring/view.tsx",
                        lineNumber: 108,
                        columnNumber: 35
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/monitoring/view.tsx",
                lineNumber: 105,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/monitoring/view.tsx",
        lineNumber: 84,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=app_dashboard_monitoring_view_tsx_1evh6-2exz4go._.js.map