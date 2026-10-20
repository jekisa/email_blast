(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/contacts/manager.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactsManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/domain.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
async function parse(response) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? 'Permintaan gagal.');
    return data;
}
const PAGE_SIZE = 100;
const sortableColumns = [
    {
        key: 'name',
        label: 'Nama'
    },
    {
        key: 'age',
        label: 'Umur'
    },
    {
        key: 'birthDate',
        label: 'Tanggal lahir'
    },
    {
        key: 'email',
        label: 'Email'
    },
    {
        key: 'city',
        label: 'Kota'
    },
    {
        key: 'status',
        label: 'Antrean'
    }
];
const emailStatusLabel = (status)=>({
        VALID: 'Format valid',
        SUSPECTED_TYPO: 'Kemungkinan typo',
        NEEDS_REVIEW: 'Perlu ditinjau',
        INVALID: 'Tidak valid',
        DUMMY: 'Email dummy',
        UNKNOWN: 'Email kosong'
    })[status];
function ContactsManager() {
    _s();
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [mapping, setMapping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: -1,
        birthDate: -1,
        email: -1
    });
    const [headers, setHeaders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [parsed, setParsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [fileName, setFileName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [importProgress, setImportProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewPage, setPreviewPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [customerPage, setCustomerPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [duplicatePage, setDuplicatePage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalCustomers, setTotalCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [duplicateRows, setDuplicateRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [customerRows, setCustomerRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [sort, setSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        key: 'name',
        dir: 'asc'
    });
    const [loadingCustomers, setLoadingCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    async function refresh(page = customerPage) {
        setLoadingCustomers(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(PAGE_SIZE),
                sort: sort.key,
                dir: sort.dir
            });
            if (query.trim()) params.set('q', query.trim());
            const data = await parse(await fetch(`/api/admin/customers?${params}`, {
                cache: 'no-store'
            }));
            setCustomerRows(data.customers);
            setTotalCustomers(data.total);
            setCustomerPage(data.page);
        } finally{
            setLoadingCustomers(false);
        }
    }
    // Search waits for a short pause in typing; sorting and searching start again from page 1.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ContactsManager.useEffect": ()=>{
            const timer = setTimeout({
                "ContactsManager.useEffect.timer": ()=>{
                    refresh(1).catch({
                        "ContactsManager.useEffect.timer": (error)=>setMessage(error.message)
                    }["ContactsManager.useEffect.timer"]);
                }
            }["ContactsManager.useEffect.timer"], 300);
            return ({
                "ContactsManager.useEffect": ()=>clearTimeout(timer)
            })["ContactsManager.useEffect"];
        }
    }["ContactsManager.useEffect"], [
        query,
        sort
    ]);
    function toggleSort(key) {
        setSort((current)=>current.key === key ? {
                key,
                dir: current.dir === 'asc' ? 'desc' : 'asc'
            } : {
                key,
                dir: 'asc'
            });
    }
    async function importAllRows(allRows, sourceName) {
        const importable = allRows.filter((row)=>row.selected && row.status === 'VALID');
        if (!importable.length) {
            setMessage('Tidak ada kontak valid untuk disimpan. Periksa pemetaan nama, tanggal lahir, dan email.');
            return;
        }
        const total = Math.ceil(importable.length / 5000);
        let completed = 0;
        setBusy(true);
        setMessage('');
        setDuplicateRows([]);
        setDuplicatePage(1);
        setImportProgress({
            completed,
            total
        });
        try {
            let imported = 0;
            let rejected = 0;
            let notAccepted = 0;
            let queued = 0;
            let inactiveByAge = 0;
            const duplicates = [];
            for(let offset = 0; offset < importable.length; offset += 5000){
                const data = await parse(await fetch('/api/admin/imports', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fileName: sourceName,
                        rows: importable.slice(offset, offset + 5000)
                    })
                }));
                duplicates.push(...data.duplicates ?? []);
                queued += data.queuedCount ?? 0;
                inactiveByAge += data.inactiveByAge ?? 0;
                rejected += data.duplicates?.length ?? 0;
                notAccepted += Math.max(0, data.batch.rejectedCount - (data.duplicates?.length ?? 0));
                if (!data.alreadyProcessed) {
                    imported += data.batch.importedCount;
                }
                completed += 1;
                setImportProgress({
                    completed,
                    total
                });
            }
            setDuplicateRows(duplicates);
            setMessage(`Impor selesai: ${imported.toLocaleString('id-ID')} kontak baru tersimpan; ${queued.toLocaleString('id-ID')} jadwal masuk antrean; ${rejected.toLocaleString('id-ID')} baris duplikat sudah tercatat${notAccepted ? `; ${notAccepted.toLocaleString('id-ID')} baris tidak memenuhi syarat` : ''}${inactiveByAge ? `; ${inactiveByAge.toLocaleString('id-ID')} kontak usia 80+ disimpan nonaktif` : ''}. Duplikat berarti kontak sudah ada, bukan bukti repeat order.`);
            setImportProgress(null);
            setRows([]);
            setParsed(null);
            setHeaders([]);
            setFileName('');
            setPreviewPage(1);
            await refresh(1);
        } catch (error) {
            setMessage(`${error instanceof Error ? error.message : 'Impor gagal.'}${completed ? ` ${Math.min(completed * 5000, importable.length).toLocaleString('id-ID')} dari ${importable.length.toLocaleString('id-ID')} kontak sudah diproses. Pilih file yang sama lagi untuk melanjutkan; data yang sudah tersimpan tidak akan digandakan.` : ''}`);
        } finally{
            setBusy(false);
        }
    }
    async function readFile(file) {
        if (!file) return;
        setBusy(true);
        setMessage('');
        setImportProgress(null);
        setDuplicateRows([]);
        setDuplicatePage(1);
        try {
            if (file.size > 10 * 1024 * 1024) throw new Error('File maksimal 10 MB.');
            const buffer = await file.arrayBuffer();
            let content;
            try {
                content = new TextDecoder('utf-8', {
                    fatal: true
                }).decode(buffer);
            } catch  {
                content = new TextDecoder('windows-1252').decode(buffer);
            }
            const parsedFile = file.name.toLowerCase().endsWith('.txt') ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseSanghyangTextReport"])(content) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDelimitedFile"])(content);
            const inferred = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inferColumnMapping"])(parsedFile.headers);
            const normalizedRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flagPotentialDuplicateRows"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImportRows"])(parsedFile, inferred));
            setFileName(file.name);
            setHeaders(parsedFile.headers);
            setParsed(parsedFile);
            setMapping(inferred);
            setRows(normalizedRows);
            setPreviewPage(1);
            if ([
                inferred.name,
                inferred.birthDate,
                inferred.email
            ].every((index)=>index >= 0)) await importAllRows(normalizedRows, file.name);
            else setMessage('File terbaca. Pilih kolom nama, tanggal lahir, dan email agar semua kontak bisa disimpan otomatis.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'File gagal dibaca.');
            setRows([]);
            setParsed(null);
            setHeaders([]);
            setFileName('');
        } finally{
            setBusy(false);
        }
    }
    async function setColumn(column, index) {
        const next = {
            ...mapping,
            [column]: index
        };
        setMapping(next);
        if (parsed) {
            const nextRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flagPotentialDuplicateRows"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImportRows"])(parsed, next));
            setRows(nextRows);
            if ([
                next.name,
                next.birthDate,
                next.email
            ].every((value)=>value >= 0)) await importAllRows(nextRows, fileName);
        }
    }
    async function setBlacklisted(customer) {
        setBusy(true);
        setMessage('');
        try {
            const data = await parse(await fetch('/api/admin/customers', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: customer.id,
                    isBlacklisted: !customer.isBlacklisted
                })
            }));
            await refresh();
            setMessage(customer.isBlacklisted ? `${data.queuedCount} jadwal masuk antrean.` : 'Kontak dikecualikan dari antrean berikutnya.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Status kontak gagal diubah.');
        } finally{
            setBusy(false);
        }
    }
    const previewPageCount = Math.ceil(rows.length / PAGE_SIZE);
    const customerPageCount = Math.ceil(totalCustomers / PAGE_SIZE);
    const duplicatePageCount = Math.ceil(duplicateRows.length / PAGE_SIZE);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "manage-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "Daftar kontak"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 136,
                        columnNumber: 48
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Umur dihitung otomatis dari tanggal lahir. Impor menyimpan semua kontak valid ke database dan melewati duplikat."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 136,
                        columnNumber: 70
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                lineNumber: 136,
                columnNumber: 40
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "manage-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "manage-card-heading",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "eyebrow",
                                    children: "BAGIAN 1"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                    lineNumber: 137,
                                    columnNumber: 80
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Import data"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                    lineNumber: 137,
                                    columnNumber: 121
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                            lineNumber: 137,
                            columnNumber: 75
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 137,
                        columnNumber: 38
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Pilih file CSV/TSV atau laporan tamu hotel (.txt). No HP dan kota ikut tersimpan bila ada di file. Kontak tersimpan otomatis setelah file terbaca."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 137,
                        columnNumber: 153
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "upload-label",
                        children: [
                            "Pilih file kontak",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
                                disabled: busy,
                                onChange: (e)=>{
                                    const file = e.target.files?.[0];
                                    e.currentTarget.value = '';
                                    void readFile(file);
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 137,
                                columnNumber: 355
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 137,
                        columnNumber: 306
                    }, this),
                    headers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "manage-grid",
                        children: [
                            'name',
                            'birthDate',
                            'email',
                            'phone',
                            'city'
                        ].map((column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    {
                                        name: 'Kolom nama',
                                        birthDate: 'Kolom tanggal lahir',
                                        email: 'Kolom email',
                                        phone: 'Kolom No HP (opsional)',
                                        city: 'Kolom kota (opsional)'
                                    }[column],
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: mapping[column] ?? -1,
                                        disabled: busy,
                                        onChange: (e)=>setColumn(column, Number(e.target.value)),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: -1,
                                                children: "Pilih kolom"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                lineNumber: 138,
                                                columnNumber: 423
                                            }, this),
                                            headers.map((header, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: index,
                                                    children: header || `Kolom ${index + 1}`
                                                }, `${header}-${index}`, false, {
                                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 494
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                        lineNumber: 138,
                                        columnNumber: 309
                                    }, this)
                                ]
                            }, column, true, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 138,
                                columnNumber: 135
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 138,
                        columnNumber: 30
                    }, this),
                    rows.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "manage-hint",
                                children: [
                                    rows.filter((row)=>row.status === 'VALID').length.toLocaleString('id-ID'),
                                    " kontak valid · umur dihitung otomatis."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 139,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "table-scroll",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Nama"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 224
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Tanggal lahir"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 237
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Umur"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 259
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 272
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Status email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 286
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Kota"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 307
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "No HP"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 320
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                lineNumber: 139,
                                                columnNumber: 220
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                            lineNumber: 139,
                                            columnNumber: 213
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: rows.slice((previewPage - 1) * PAGE_SIZE, previewPage * PAGE_SIZE).map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: row.fullName || '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                            lineNumber: 139,
                                                            columnNumber: 462
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: row.birthDate || '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                            lineNumber: 139,
                                                            columnNumber: 492
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateAge"])(row.birthDate) ?? '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                            lineNumber: 139,
                                                            columnNumber: 523
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: row.rawEmail || '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                            lineNumber: 139,
                                                            columnNumber: 568
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: emailStatusLabel(row.emailStatus)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                            lineNumber: 139,
                                                            columnNumber: 598
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: row.city || '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                            lineNumber: 139,
                                                            columnNumber: 642
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: row.phone || '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                            lineNumber: 139,
                                                            columnNumber: 668
                                                        }, this)
                                                    ]
                                                }, row.recordNumber, true, {
                                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                    lineNumber: 139,
                                                    columnNumber: 435
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                            lineNumber: 139,
                                            columnNumber: 347
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                    lineNumber: 139,
                                    columnNumber: 206
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 139,
                                columnNumber: 176
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "contacts-pagination",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Pratinjau ",
                                            (previewPage - 1) * PAGE_SIZE + 1,
                                            "–",
                                            Math.min(previewPage * PAGE_SIZE, rows.length),
                                            " dari ",
                                            rows.length.toLocaleString('id-ID')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                        lineNumber: 139,
                                        columnNumber: 761
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "outline-button",
                                        disabled: previewPage <= 1,
                                        onClick: ()=>setPreviewPage((page)=>page - 1),
                                        children: "Sebelumnya"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                        lineNumber: 139,
                                        columnNumber: 913
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Halaman ",
                                            previewPage,
                                            " dari ",
                                            previewPageCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                        lineNumber: 139,
                                        columnNumber: 1046
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "outline-button",
                                        disabled: previewPage >= previewPageCount,
                                        onClick: ()=>setPreviewPage((page)=>page + 1),
                                        children: "Berikutnya"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                        lineNumber: 139,
                                        columnNumber: 1104
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 139,
                                columnNumber: 724
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 139,
                        columnNumber: 27
                    }, this),
                    importProgress && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "import-progress",
                        role: "status",
                        "aria-live": "polite",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: `Menyimpan bagian ${Math.min(importProgress.completed + 1, importProgress.total)} dari ${importProgress.total}...`
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 140,
                                columnNumber: 92
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("progress", {
                                max: importProgress.total,
                                value: importProgress.completed
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 140,
                                columnNumber: 221
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 140,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                lineNumber: 137,
                columnNumber: 5
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "manage-message",
                role: "status",
                children: message
            }, void 0, false, {
                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                lineNumber: 142,
                columnNumber: 17
            }, this),
            duplicateRows.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "manage-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "manage-card-heading",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "eyebrow",
                                    children: "HASIL IMPOR"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                    lineNumber: 143,
                                    columnNumber: 109
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: [
                                        "Kontak duplikat / sudah tercatat ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "count-pill",
                                            children: duplicateRows.length.toLocaleString('id-ID')
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                            lineNumber: 143,
                                            columnNumber: 190
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                    lineNumber: 143,
                                    columnNumber: 153
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                            lineNumber: 143,
                            columnNumber: 104
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 143,
                        columnNumber: 67
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Baris ini dilewati karena kontaknya sudah ada di database. Ini tidak menunjukkan riwayat repeat order."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 143,
                        columnNumber: 289
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "table-scroll",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Nama"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                lineNumber: 143,
                                                columnNumber: 446
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Umur"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                lineNumber: 143,
                                                columnNumber: 459
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Tanggal lahir"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                lineNumber: 143,
                                                columnNumber: 472
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Email"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                lineNumber: 143,
                                                columnNumber: 494
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                lineNumber: 143,
                                                columnNumber: 508
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                        lineNumber: 143,
                                        columnNumber: 442
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                    lineNumber: 143,
                                    columnNumber: 435
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: duplicateRows.slice((duplicatePage - 1) * PAGE_SIZE, duplicatePage * PAGE_SIZE).map((contact, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: contact.fullName || '—'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 702
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateAge"])(contact.birthDate) ?? '—'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 736
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: contact.birthDate
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 785
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: contact.email
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 813
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: "Sudah tercatat"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 837
                                                }, this)
                                            ]
                                        }, `${contact.recordNumber ?? 'row'}-${index}`, true, {
                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                            lineNumber: 143,
                                            columnNumber: 648
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                    lineNumber: 143,
                                    columnNumber: 536
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                            lineNumber: 143,
                            columnNumber: 428
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 143,
                        columnNumber: 398
                    }, this),
                    duplicatePageCount > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "contacts-pagination",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Baris ",
                                    (duplicatePage - 1) * PAGE_SIZE + 1,
                                    "–",
                                    Math.min(duplicatePage * PAGE_SIZE, duplicateRows.length),
                                    " dari ",
                                    duplicateRows.length.toLocaleString('id-ID')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 143,
                                columnNumber: 953
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "outline-button",
                                disabled: duplicatePage <= 1,
                                onClick: ()=>setDuplicatePage((page)=>page - 1),
                                children: "Sebelumnya"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 143,
                                columnNumber: 1123
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Halaman ",
                                    duplicatePage,
                                    " dari ",
                                    duplicatePageCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 143,
                                columnNumber: 1260
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "outline-button",
                                disabled: duplicatePage >= duplicatePageCount,
                                onClick: ()=>setDuplicatePage((page)=>page + 1),
                                children: "Berikutnya"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 143,
                                columnNumber: 1322
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 143,
                        columnNumber: 916
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                lineNumber: 143,
                columnNumber: 34
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "manage-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "manage-card-heading",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "eyebrow",
                                    children: "BAGIAN 2"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                    lineNumber: 144,
                                    columnNumber: 80
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: [
                                        "Daftar kontak tersimpan ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "count-pill",
                                            children: totalCustomers.toLocaleString('id-ID')
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                            lineNumber: 144,
                                            columnNumber: 149
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                    lineNumber: 144,
                                    columnNumber: 121
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                            lineNumber: 144,
                            columnNumber: 75
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 144,
                        columnNumber: 38
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Klik judul kolom untuk mengurutkan. Cari berdasarkan nama, email, kota, atau No HP."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 144,
                        columnNumber: 242
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "contacts-search",
                        children: [
                            "Cari kontak",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "search",
                                value: query,
                                onChange: (e)=>setQuery(e.target.value),
                                placeholder: "Nama, email, kota, atau No HP",
                                maxLength: 120
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 144,
                                columnNumber: 378
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 144,
                        columnNumber: 332
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "table-scroll",
                        "aria-busy": loadingCustomers,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                sortableColumns.map((column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        "aria-sort": sort.key === column.key ? sort.dir === 'asc' ? 'ascending' : 'descending' : 'none',
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            className: "sort-button",
                                                            onClick: ()=>toggleSort(column.key),
                                                            children: [
                                                                column.label,
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    "aria-hidden": "true",
                                                                    children: sort.key === column.key ? sort.dir === 'asc' ? ' ▲' : ' ▼' : ' ↕'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                                    lineNumber: 144,
                                                                    columnNumber: 853
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                            lineNumber: 144,
                                                            columnNumber: 754
                                                        }, this)
                                                    }, column.key, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 636
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Aksi"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 970
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                            lineNumber: 144,
                                            columnNumber: 599
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                        lineNumber: 144,
                                        columnNumber: 592
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: customerRows.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: customer.fullName || '—'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 1057
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateAge"])(customer.birthDate.slice(0, 10)) ?? '—'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 1092
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: customer.birthDate.slice(0, 10)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 1155
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: [
                                                            customer.email,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                className: "table-detail",
                                                                children: customer.phone || 'No HP —'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                                lineNumber: 144,
                                                                columnNumber: 1217
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 1197
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: customer.city || '—'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 1291
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: customer.isBlacklisted ? 'Dikecualikan' : 'Aktif'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 1322
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "outline-button",
                                                            disabled: busy,
                                                            onClick: ()=>setBlacklisted(customer),
                                                            children: customer.isBlacklisted ? 'Izinkan kembali' : 'Kecualikan'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                            lineNumber: 144,
                                                            columnNumber: 1386
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 1382
                                                    }, this)
                                                ]
                                            }, customer.id, true, {
                                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                                lineNumber: 144,
                                                columnNumber: 1035
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                        lineNumber: 144,
                                        columnNumber: 996
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 144,
                                columnNumber: 585
                            }, this),
                            !totalCustomers && !loadingCustomers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: query.trim() ? `Tidak ada kontak yang cocok dengan “${query.trim()}”.` : 'Belum ada kontak di database Birthday Automation.'
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 144,
                                columnNumber: 1615
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 144,
                        columnNumber: 526
                    }, this),
                    customerPageCount > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "contacts-pagination",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Kontak ",
                                    (customerPage - 1) * PAGE_SIZE + 1,
                                    "–",
                                    Math.min(customerPage * PAGE_SIZE, totalCustomers),
                                    " dari ",
                                    totalCustomers.toLocaleString('id-ID')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 144,
                                columnNumber: 1818
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "outline-button",
                                disabled: busy || customerPage <= 1,
                                onClick: ()=>refresh(customerPage - 1),
                                children: "Sebelumnya"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 144,
                                columnNumber: 1975
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Halaman ",
                                    customerPage,
                                    " dari ",
                                    customerPageCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 144,
                                columnNumber: 2108
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "outline-button",
                                disabled: busy || customerPage >= customerPageCount,
                                onClick: ()=>refresh(customerPage + 1),
                                children: "Berikutnya"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                                lineNumber: 144,
                                columnNumber: 2168
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/contacts/manager.tsx",
                        lineNumber: 144,
                        columnNumber: 1781
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/contacts/manager.tsx",
                lineNumber: 144,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/contacts/manager.tsx",
        lineNumber: 136,
        columnNumber: 10
    }, this);
}
_s(ContactsManager, "/uoLkXWqPalJlnOvK4/gZ3Tzw0c=");
_c = ContactsManager;
var _c;
__turbopack_context__.k.register(_c, "ContactsManager");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/domain.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "birthdayMidnightJakarta",
    ()=>birthdayMidnightJakarta,
    "birthdaySchedule",
    ()=>birthdaySchedule,
    "calculateAge",
    ()=>calculateAge,
    "flagPotentialDuplicateRows",
    ()=>flagPotentialDuplicateRows,
    "inferColumnMapping",
    ()=>inferColumnMapping,
    "jakartaDateParts",
    ()=>jakartaDateParts,
    "normalizeBirthDate",
    ()=>normalizeBirthDate,
    "normalizeEmail",
    ()=>normalizeEmail,
    "normalizeImportRows",
    ()=>normalizeImportRows,
    "normalizeName",
    ()=>normalizeName,
    "normalizePhone",
    ()=>normalizePhone,
    "parseDelimitedFile",
    ()=>parseDelimitedFile,
    "parseLocation",
    ()=>parseLocation,
    "parseSanghyangTextReport",
    ()=>parseSanghyangTextReport,
    "previewTemplate",
    ()=>previewTemplate,
    "scheduleDate",
    ()=>scheduleDate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$recipient$2d$eligibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/birthday-recipient-eligibility.ts [app-client] (ecmascript)");
;
const DUMMY_EMAIL_MARKERS = [
    'noemail@',
    'no-email@',
    'tidakada@',
    'dummy@',
    'test@',
    'none@',
    'guest@sanghyang'
];
const TITLES = /^(MR|MRS|MS|MISS|DR|DRS|DRA|PROF|HJ|HAJI|IR)\.?\s+/i;
function normalizeName(value) {
    const withoutTitle = value.trim().replace(TITLES, '');
    const cleaned = withoutTitle.replace(/[^\p{L}\p{M}\s'-]/gu, ' ').replace(/\s+/g, ' ').trim();
    const fullName = cleaned.split(' ').filter(Boolean).map((word)=>word[0].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()).join(' ');
    const firstName = fullName.split(' ')[0] ?? '';
    return {
        fullName,
        firstName
    };
}
function normalizeEmail(value) {
    const email = value.trim().toLocaleLowerCase();
    if (!email) return {
        email,
        status: 'UNKNOWN',
        suggestion: ''
    };
    if (DUMMY_EMAIL_MARKERS.some((marker)=>email.includes(marker))) return {
        email,
        status: 'DUMMY',
        suggestion: ''
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {
        email,
        status: 'INVALID',
        suggestion: ''
    };
    const domain = email.split('@').at(-1) ?? '';
    const correctedDomain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$recipient$2d$eligibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["correctMailDomain"])(domain);
    return correctedDomain ? {
        email,
        status: 'SUSPECTED_TYPO',
        suggestion: email.replace(/@[^@]+$/, `@${correctedDomain}`)
    } : {
        email,
        status: 'VALID',
        suggestion: ''
    };
}
function normalizePhone(value) {
    const first = value.split(/[/,;]/)[0].trim();
    const digits = first.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) return '';
    if (first.startsWith('+')) return `+${digits}`;
    if (digits.startsWith('62')) return `+${digits}`;
    if (digits.startsWith('0')) return `+62${digits.slice(1)}`;
    if (digits.startsWith('8')) return `+62${digits}`;
    return digits;
}
function parseLocation(value) {
    const match = /\b([A-Z]{3})\s*-\s+([A-Za-z][A-Za-z .'/()-]*?)\s*$/.exec(value.trim());
    const titleCase = (text)=>text.toLocaleLowerCase().replace(/(^|[\s/(-])(\p{L})/gu, (_, gap, letter)=>gap + letter.toLocaleUpperCase());
    if (match) return {
        countryCode: match[1],
        city: titleCase(match[2].replace(/\s+/g, ' ').trim()).slice(0, 80)
    };
    const city = value.replace(/\s+/g, ' ').trim();
    return {
        countryCode: '',
        city: city ? titleCase(city).slice(0, 80) : ''
    };
}
function normalizeBirthDate(value) {
    const text = value.trim();
    let year = 0;
    let month = 0;
    let day = 0;
    let match = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(text);
    if (match) {
        year = Number(match[1]);
        month = Number(match[2]);
        day = Number(match[3]);
    } else {
        match = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(text);
        if (match) {
            day = Number(match[1]);
            month = Number(match[2]);
            year = Number(match[3]);
        } else {
            match = /^(\d{1,2})[-\s]([A-Za-z]{3,})[-\s](\d{4})$/.exec(text);
            if (!match) return null;
            day = Number(match[1]);
            year = Number(match[3]);
            month = new Date(`${match[2]} 1, 2000`).getMonth() + 1;
            if (!month) return null;
        }
    }
    const date = new Date(Date.UTC(year, month - 1, day));
    if (year < 1900 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    const today = jakartaDateParts(new Date());
    const birthday = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const todayIso = `${today.year}-${today.month}-${today.day}`;
    return birthday <= todayIso ? birthday : null;
}
function jakartaDateParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(({ type, value })=>[
            type,
            value
        ]));
    return {
        year: values.year,
        month: values.month,
        day: values.day
    };
}
function birthdayMidnightJakarta(birthDate, year) {
    const isoDate = birthDate instanceof Date ? birthDate.toISOString().slice(0, 10) : birthDate;
    const [, month, originalDay] = isoDate.split('-').map(Number);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const day = month === 2 && originalDay === 29 && !leap ? 28 : originalDay;
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return new Date(`${date}T00:00:00+07:00`);
}
function calculateAge(birthDate, today = new Date()) {
    const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number);
    if (!birthYear || !birthMonth || !birthDay) return null;
    const current = jakartaDateParts(today);
    const year = Number(current.year);
    const month = Number(current.month);
    const day = Number(current.day);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const anniversaryDay = birthMonth === 2 && birthDay === 29 && !leap ? 28 : birthDay;
    return year - birthYear - (month < birthMonth || month === birthMonth && day < anniversaryDay ? 1 : 0);
}
function birthdaySchedule(birthDate, offsetDays, today = new Date()) {
    const parts = jakartaDateParts(today);
    const [, month, day] = birthDate.split('-').map(Number);
    const validationDate = new Date(Date.UTC(2000, month - 1, day));
    if (!Number.isInteger(month) || !Number.isInteger(day) || month < 1 || month > 12 || day < 1 || validationDate.getUTCMonth() !== month - 1 || validationDate.getUTCDate() !== day || !Number.isInteger(offsetDays) || offsetDays < -366 || offsetDays > 366) return null;
    const todayIso = `${parts.year}-${parts.month}-${parts.day}`;
    let year = Number(parts.year);
    const dateForYear = (birthdayYear)=>{
        const leap = birthdayYear % 4 === 0 && (birthdayYear % 100 !== 0 || birthdayYear % 400 === 0);
        const effectiveDay = month === 2 && day === 29 && !leap ? 28 : day;
        const scheduled = new Date(Date.UTC(birthdayYear, month - 1, effectiveDay + offsetDays));
        return `${scheduled.getUTCFullYear()}-${String(scheduled.getUTCMonth() + 1).padStart(2, '0')}-${String(scheduled.getUTCDate()).padStart(2, '0')}`;
    };
    let date = dateForYear(year);
    if (date < todayIso) date = dateForYear(++year);
    return {
        birthdayYear: year,
        date
    };
}
function scheduleDate(birthDate, offsetDays, today = new Date()) {
    return birthdaySchedule(birthDate, offsetDays, today)?.date ?? '';
}
function parseDelimited(text, delimiter) {
    const rows = [];
    let row = [];
    let field = '';
    let quoted = false;
    for(let i = 0; i < text.length; i += 1){
        const char = text[i];
        if (char === '"') {
            if (quoted && text[i + 1] === '"') {
                field += '"';
                i += 1;
            } else quoted = !quoted;
        } else if (char === delimiter && !quoted) {
            row.push(field);
            field = '';
        } else if ((char === '\n' || char === '\r') && !quoted) {
            if (char === '\r' && text[i + 1] === '\n') i += 1;
            row.push(field);
            field = '';
            if (row.some((cell)=>cell.trim())) rows.push(row);
            row = [];
        } else field += char;
    }
    row.push(field);
    if (row.some((cell)=>cell.trim())) rows.push(row);
    if (quoted) throw new Error('File berisi tanda kutip yang tidak berpasangan.');
    return rows;
}
function parseDelimitedFile(text) {
    const content = text.replace(/^\uFEFF/, '');
    const candidates = [
        '\t',
        '|',
        ',',
        ';'
    ].map((delimiter)=>({
            delimiter,
            rows: parseDelimited(content, delimiter)
        }));
    const best = candidates.sort((a, b)=>{
        const score = (rows)=>rows.slice(0, 25).filter((row)=>row.length > 1).length * 100 + Math.min(50, Math.max(...rows.slice(0, 25).map((row)=>row.length), 0));
        return score(b.rows) - score(a.rows);
    })[0];
    if (!best || best.rows.length < 2 || best.rows[0].length < 2) throw new Error('Tidak menemukan kolom tabel. Gunakan CSV atau TSV dengan baris header.');
    const width = best.rows[0].length;
    const normalizedRows = best.rows.slice(1).map((row)=>[
            ...row.slice(0, width),
            ...Array(Math.max(0, width - row.length)).fill('')
        ]);
    return {
        headers: best.rows[0].map((header)=>header.trim()),
        rows: normalizedRows,
        delimiter: best.delimiter,
        sourceFormat: 'delimited'
    };
}
const reportPlace = /\b([A-Z]{3})\s*-\s+([A-Za-z][A-Za-z .'/()-]*?)(?=\s{2,}|\s*[+\d]|$)/g;
function parseSanghyangTextReport(text) {
    const lines = text.replace(/^\uFEFF/, '').split(/\r\n|\r|\n|\f/);
    const hasExpectedHeader = lines.some((line)=>line.length >= 160 && /guest\s+name/i.test(line.slice(0, 37)) && /birthdate/i.test(line.slice(37, 52)) && /email/i.test(line.slice(150, 175)));
    if (!hasExpectedHeader) throw new Error('Format laporan tamu tidak dikenali; tidak ada data yang disimpan.');
    const rows = [];
    for (const line of lines){
        if (line.length < 170) continue;
        const rawBirthDate = line.slice(37, 47).trim();
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(rawBirthDate)) continue;
        const sourceName = line.slice(0, 37).trim();
        const comma = sourceName.indexOf(',');
        const rawName = comma > 0 ? `${sourceName.slice(comma + 1).trim()} ${sourceName.slice(0, comma).trim()}` : sourceName;
        const rawEmail = line.slice(157).trim();
        // Mobile No (141-157) if usable, else Tel No (120-141). The street address (71-104) is not kept; it often
        // overflows into City, so the "INA -  SERANG" pair nearest the City column (104) is taken from 71-141.
        const phone = normalizePhone(line.slice(141, 157)) || normalizePhone(line.slice(120, 141));
        let place;
        for (const match of line.slice(71, 141).matchAll(reportPlace))if (!place || Math.abs(match.index + 71 - 104) < Math.abs(place.index + 71 - 104)) place = match;
        rows.push([
            rawName,
            rawBirthDate,
            rawEmail,
            phone,
            place ? `${place[1]} - ${place[2]}` : ''
        ]);
    }
    if (rows.length < 25) throw new Error('Baris pelanggan laporan tidak cukup untuk memastikan format; tidak ada data yang disimpan.');
    return {
        headers: [
            'Guest Name',
            'Birthdate',
            'Email Address',
            'Phone',
            'City'
        ],
        rows,
        delimiter: 'fixed-width',
        sourceFormat: 'sanghyang-report',
        previewOnly: true
    };
}
function findColumn(headers, aliases) {
    const normalized = headers.map((header)=>header.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim());
    return normalized.findIndex((header)=>aliases.some((alias)=>header === alias || header.includes(alias)));
}
function inferColumnMapping(headers) {
    return {
        name: findColumn(headers, [
            'guest name',
            'full name',
            'customer name',
            'name'
        ]),
        birthDate: findColumn(headers, [
            'birthdate',
            'birth date',
            'date of birth',
            'dob'
        ]),
        email: findColumn(headers, [
            'email address',
            'email'
        ]),
        phone: findColumn(headers, [
            'phone',
            'mobile',
            'handphone',
            'no hp',
            'tel no',
            'telephone'
        ]),
        city: findColumn(headers, [
            'city',
            'kota'
        ])
    };
}
function normalizeImportRows(parsed, mapping) {
    return parsed.rows.map((row, index)=>{
        const rawName = row[mapping.name] ?? '';
        const rawBirthDate = row[mapping.birthDate] ?? '';
        const rawEmail = row[mapping.email] ?? '';
        const { fullName, firstName } = normalizeName(rawName);
        const birthDate = normalizeBirthDate(rawBirthDate);
        const email = normalizeEmail(rawEmail);
        const phone = mapping.phone !== undefined && mapping.phone >= 0 ? normalizePhone(row[mapping.phone] ?? '') : '';
        const location = mapping.city !== undefined && mapping.city >= 0 ? parseLocation(row[mapping.city] ?? '') : {
            city: '',
            countryCode: ''
        };
        const reviewReason = [];
        if (fullName.split(' ').length < 2) reviewReason.push('Nama perlu ditinjau');
        if (!birthDate) reviewReason.push('Tanggal lahir tidak terbaca atau di masa depan');
        if (email.status === 'SUSPECTED_TYPO') reviewReason.push(`Domain email salah ketik; disimpan sebagai ${email.suggestion}`);
        if (email.status === 'INVALID' || email.status === 'DUMMY' || email.status === 'UNKNOWN') reviewReason.push(`Email ${email.status.toLowerCase()}`);
        const score = Math.max(0, (fullName ? 25 : 0) + (birthDate ? 35 : 0) + (email.status === 'VALID' ? 40 : 0) - reviewReason.length * 8);
        const status = !fullName || !birthDate ? 'ERROR' : 'VALID';
        return {
            recordNumber: index + 2,
            rawName,
            rawBirthDate,
            rawEmail,
            fullName,
            firstName,
            birthDate: birthDate ?? '',
            emailNormalized: email.email,
            emailSuggestion: email.suggestion,
            emailStatus: email.status,
            phone,
            city: location.city,
            countryCode: location.countryCode,
            dataQualityScore: score,
            status,
            reviewReason,
            selected: status !== 'ERROR'
        };
    });
}
function flagPotentialDuplicateRows(rows) {
    const groups = new Map();
    rows.forEach((row, index)=>{
        if (!row.birthDate) return;
        const nameKey = row.fullName ? `name:${row.fullName.toLocaleLowerCase()}|${row.birthDate}` : '';
        const emailKey = row.emailNormalized ? `email:${row.emailNormalized}|${row.birthDate}` : '';
        for (const key of [
            nameKey,
            emailKey
        ].filter(Boolean)){
            const indices = groups.get(key);
            if (indices) indices.push(index);
            else groups.set(key, [
                index
            ]);
        }
    });
    const duplicates = new Set();
    groups.forEach((indices)=>{
        if (indices.length > 1) indices.forEach((index)=>duplicates.add(index));
    });
    return rows.map((row, index)=>{
        if (!duplicates.has(index)) return row;
        const reason = 'Kemungkinan duplikat nama/email dan tanggal lahir; perlu review';
        return {
            ...row,
            reviewReason: [
                ...new Set([
                    ...row.reviewReason,
                    reason
                ])
            ]
        };
    });
}
function previewTemplate(body, customer, promoTitle = 'Birthday gift') {
    return body.replaceAll('{{first_name}}', customer.firstName).replaceAll('{{promo_name}}', promoTitle).replaceAll('{{booking_url}}', 'https://example.com/booking');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/birthday-recipient-eligibility.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ageOn",
    ()=>ageOn,
    "correctBirthdayEmail",
    ()=>correctBirthdayEmail,
    "correctMailDomain",
    ()=>correctMailDomain,
    "isEligibleBirthdayRecipient",
    ()=>isEligibleBirthdayRecipient,
    "isMisspeltMailDomain",
    ()=>isMisspeltMailDomain,
    "isUsableBirthdayEmail",
    ()=>isUsableBirthdayEmail,
    "maxBirthdayAge",
    ()=>maxBirthdayAge,
    "testSources",
    ()=>testSources
]);
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dummyMarkers = [
    'noemail@',
    'no-email@',
    'tidakada@',
    'dummy@',
    'test@',
    'none@',
    'guest@sanghyang'
];
// Misspelt webmail domains (gamil.com, gmail.comm, yahoo.co.com) bounce or reach typo-squatters; bounces count
// against the SMTP account's hourly failure quota, which stopped sending on 15 Oct 2026.
const knownMailDomains = new Set([
    'gmail.com',
    'googlemail.com',
    'yahoo.com',
    'yahoo.co.id',
    'ymail.com',
    'rocketmail.com',
    'hotmail.com',
    'outlook.com',
    'live.com',
    'msn.com',
    'icloud.com',
    'me.com',
    'aol.com',
    'mail.com',
    'email.com'
]);
const typoTargets = [
    'gmail.com',
    'yahoo.com',
    'yahoo.co.id',
    'hotmail.com',
    'outlook.com'
];
const typoSuffix = /\.(comm|con|coom|co\.com)$/;
const regionalWebmail = /^(yahoo|hotmail|outlook|live)\.(co|com)\.[a-z]{2}$/;
function editDistance(a, b) {
    let previous = Array.from({
        length: b.length + 1
    }, (_, index)=>index);
    for(let i = 1; i <= a.length; i++){
        const current = [
            i
        ];
        for(let j = 1; j <= b.length; j++)current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        previous = current;
    }
    return previous[b.length];
}
function isMisspeltMailDomain(domain) {
    if (knownMailDomains.has(domain) || regionalWebmail.test(domain)) return false;
    return typoSuffix.test(domain) || typoTargets.some((target)=>editDistance(domain, target) <= 2);
}
function correctMailDomain(domain) {
    if (!isMisspeltMailDomain(domain)) return null;
    // Owner's call (15 Oct 2026): yahoo.co.com means yahoo.com.
    if (domain.endsWith('.co.com') && typoTargets.includes(domain.replace(/\.co\.com$/, '.com'))) return domain.replace(/\.co\.com$/, '.com');
    const [best, next] = typoTargets.map((target)=>({
            target,
            distance: editDistance(domain, target)
        })).sort((a, b)=>a.distance - b.distance);
    return best.distance <= 2 && best.distance < next.distance ? best.target : null;
}
function correctBirthdayEmail(email) {
    const trimmed = email.trim();
    const at = trimmed.lastIndexOf('@');
    const fix = at > 0 ? correctMailDomain(trimmed.slice(at + 1).toLocaleLowerCase()) : null;
    return fix ? `${trimmed.slice(0, at + 1)}${fix}` : trimmed;
}
function isUsableBirthdayEmail(email) {
    const normalizedEmail = email.trim().toLocaleLowerCase();
    return validEmail.test(normalizedEmail) && !dummyMarkers.some((marker)=>normalizedEmail.includes(marker)) && !isMisspeltMailDomain(normalizedEmail.slice(normalizedEmail.lastIndexOf('@') + 1));
}
function isEligibleBirthdayRecipient(email, isActive, isBlacklisted) {
    return isActive && !isBlacklisted && isUsableBirthdayEmail(email);
}
function ageOn(birthDateIso, dayIso) {
    const years = Number(dayIso.slice(0, 4)) - Number(birthDateIso.slice(0, 4));
    return dayIso.slice(5) < birthDateIso.slice(5) ? years - 1 : years;
}
const maxBirthdayAge = 80;
const testSources = [
    'manual',
    'birthday_email_test'
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=_1f7wzd86y7jlx._.js.map