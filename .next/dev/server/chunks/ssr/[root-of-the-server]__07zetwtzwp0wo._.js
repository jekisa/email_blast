module.exports = [
(()=>{"use strict";return[
"[project]/app/dashboard/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "default",
    ()=>DashboardPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/domain.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$forecast$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/birthday-forecast.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$recipient$2d$eligibility$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/birthday-recipient-eligibility.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$problem$2d$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/problem-list.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$csv$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/csv.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$forecast$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$forecast$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
const dynamic = 'force-dynamic';
const stuckAfterMs = 10 * 60 * 1000;
const isoDay = (date)=>{
    const parts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jakartaDateParts"])(date);
    return `${parts.year}-${parts.month}-${parts.day}`;
};
const jakartaLabel = (date, options)=>new Intl.DateTimeFormat('id-ID', {
        ...options,
        timeZone: 'Asia/Jakarta'
    }).format(date);
async function DashboardPage() {
    const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"].api.getSession({
        headers: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])()
    });
    if (!session || session.user.role !== 'admin') (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jakartaDateParts"])();
    const dayStart = new Date(`${today.year}-${today.month}-${today.day}T00:00:00+07:00`);
    const tomorrowStart = new Date(dayStart.getTime() + 86_400_000);
    const tomorrow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jakartaDateParts"])(tomorrowStart);
    const tomorrowIso = `${tomorrow.year}-${tomorrow.month}-${tomorrow.day}`;
    const realCustomer = {
        source: {
            notIn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$recipient$2d$eligibility$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testSources"]
        }
    };
    const clickedToday = (eventType)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].deliveryEvent.findMany({
            where: {
                eventType,
                occurredAt: {
                    gte: dayStart,
                    lt: tomorrowStart
                },
                dispatch: {
                    customer: realCustomer
                }
            },
            orderBy: {
                occurredAt: 'asc'
            },
            select: {
                occurredAt: true,
                dispatch: {
                    select: {
                        customerId: true,
                        customer: {
                            select: {
                                fullName: true,
                                email: true,
                                phone: true,
                                city: true
                            }
                        }
                    }
                }
            }
        });
    const [sentToday, whatsappClicks, webClicks, queuedTomorrow, upcomingTomorrow, problems] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].birthdayDispatch.count({
            where: {
                status: 'accepted',
                acceptedAt: {
                    gte: dayStart,
                    lt: tomorrowStart
                },
                customer: realCustomer
            }
        }),
        clickedToday('whatsapp_clicked'),
        clickedToday('link_clicked'),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].birthdayDispatch.count({
            where: {
                status: 'queued',
                scheduledAt: {
                    gte: tomorrowStart,
                    lt: new Date(tomorrowStart.getTime() + 86_400_000)
                },
                customer: realCustomer,
                campaign: {
                    status: 'active'
                }
            }
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$forecast$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forecastSends"])(tomorrowIso, tomorrowIso),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].birthdayDispatch.findMany({
            where: {
                customer: realCustomer,
                OR: [
                    {
                        status: {
                            in: [
                                'error',
                                'rejected'
                            ]
                        }
                    },
                    {
                        status: 'processing',
                        claimedAt: {
                            lt: new Date(Date.now() - stuckAfterMs)
                        }
                    }
                ]
            },
            orderBy: {
                scheduledAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                scheduledAt: true,
                errorMessage: true,
                attemptCount: true,
                customer: {
                    select: {
                        fullName: true,
                        email: true
                    }
                },
                events: {
                    where: {
                        eventType: 'smtp_accepted'
                    },
                    select: {
                        id: true
                    },
                    take: 1
                }
            }
        })
    ]);
    // First click per customer today, for the counts and the name lists.
    const clickers = (rows)=>[
            ...new Map(rows.map((row)=>[
                    row.dispatch.customerId,
                    row
                ])).values()
        ].reverse().map((row)=>({
                id: row.dispatch.customerId,
                name: row.dispatch.customer.fullName || row.dispatch.customer.email,
                email: row.dispatch.customer.email,
                phone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$csv$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["displayPhone"])(row.dispatch.customer.phone),
                city: row.dispatch.customer.city ?? '',
                time: jakartaLabel(row.occurredAt, {
                    timeStyle: 'short'
                })
            }));
    const whatsappClickers = clickers(whatsappClicks);
    const webClickers = clickers(webClicks);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "admin-content",
        id: "dashboard",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-heading",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "eyebrow",
                            children: "BIRTHDAY EMAIL"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 48,
                            columnNumber: 41
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 48,
                            columnNumber: 88
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "Hari ini, ",
                                jakartaLabel(dayStart, {
                                    dateStyle: 'full'
                                }),
                                "."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 48,
                            columnNumber: 106
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 48,
                    columnNumber: 36
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 48,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "admin-metrics",
                "aria-label": "Ringkasan hari ini",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Terkirim hari ini"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 50,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: sentToday.toLocaleString('id-ID')
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 50,
                                columnNumber: 46
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "email diterima server SMTP"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 50,
                                columnNumber: 98
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 50,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: "metric-link whatsapp",
                        href: "#klik-whatsapp",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Klik WhatsApp hari ini"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 51,
                                columnNumber: 65
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: whatsappClickers.length.toLocaleString('id-ID')
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 51,
                                columnNumber: 100
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "customer unik · klik untuk lihat nama"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 51,
                                columnNumber: 166
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 51,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: "metric-link",
                        href: "#klik-web",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Klik web hari ini"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 52,
                                columnNumber: 51
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: webClickers.length.toLocaleString('id-ID')
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 52,
                                columnNumber: 81
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "customer unik ke sanghyang.com · klik untuk lihat nama"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 52,
                                columnNumber: 142
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 52,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Besok"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 53,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: (queuedTomorrow + upcomingTomorrow.length).toLocaleString('id-ID')
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 53,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: [
                                    "customer, ",
                                    jakartaLabel(tomorrowStart, {
                                        day: 'numeric',
                                        month: 'long'
                                    }),
                                    " pukul 00.00 WIB"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 53,
                                columnNumber: 119
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 53,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: `metric-link${problems.length ? ' needs-attention' : ''}`,
                        href: "#perlu-diperiksa",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Perlu diperiksa"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 54,
                                columnNumber: 104
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: problems.length.toLocaleString('id-ID')
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 54,
                                columnNumber: 132
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: problems.length ? 'klik untuk lihat kontak' : 'tidak ada masalah'
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 54,
                                columnNumber: 190
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 54,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 49,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ClickList, {
                id: "klik-whatsapp",
                title: "Klik WhatsApp hari ini",
                note: "Customer yang menekan tombol Claim Your Birthday Treats. Ini tidak memastikan pesan WhatsApp terkirim.",
                people: whatsappClickers
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 56,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(ClickList, {
                id: "klik-web",
                title: "Klik web hari ini",
                note: "Customer yang membuka tautan sanghyang.com dari email. Pemindai keamanan email juga dapat tercatat.",
                people: webClickers
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 57,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "admin-panel",
                id: "export-klaim",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "panel-heading",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Export klaim"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 58,
                                    columnNumber: 92
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Unduh daftar customer yang menekan Claim Your Birthday Treats (nama, email, No HP, kota, jam klik) sebagai CSV untuk Excel. No HP berasal dari data tamu hotel."
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 58,
                                    columnNumber: 113
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 58,
                            columnNumber: 87
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 58,
                        columnNumber: 56
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        className: "export-form",
                        action: "/api/admin/exports/claims",
                        method: "get",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Dari",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        name: "from",
                                        defaultValue: isoDay(new Date(dayStart.getTime() - 29 * 86_400_000)),
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 60,
                                        columnNumber: 20
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 60,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Sampai",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        name: "to",
                                        defaultValue: isoDay(dayStart),
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 61,
                                        columnNumber: 22
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 61,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Kanal",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "channel",
                                        defaultValue: "whatsapp",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "whatsapp",
                                                children: "Claim (WhatsApp)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 62,
                                                columnNumber: 68
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "web",
                                                children: "Website"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 62,
                                                columnNumber: 118
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "Keduanya"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/page.tsx",
                                                lineNumber: 62,
                                                columnNumber: 154
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 62,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 62,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                children: "Download CSV"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 63,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 59,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 58,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "admin-panel",
                id: "perlu-diperiksa",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "panel-heading",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Perlu diperiksa"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 66,
                                        columnNumber: 95
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Pengiriman gagal atau terhenti. Kirim ulang hanya sekali, dan hanya jika SMTP belum pernah menerima email ini."
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 66,
                                        columnNumber: 119
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 66,
                                columnNumber: 90
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/dashboard/monitoring",
                                children: "Buka monitoring"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 66,
                                columnNumber: 242
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 66,
                        columnNumber: 59
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$problem$2d$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        problems: problems.map((problem)=>({
                                id: problem.id,
                                name: problem.customer.fullName || problem.customer.email,
                                email: problem.customer.email,
                                date: jakartaLabel(problem.scheduledAt, {
                                    dateStyle: 'medium'
                                }),
                                reason: problem.status === 'processing' ? 'Terhenti saat diproses; hasil SMTP tidak diketahui.' : problem.errorMessage ?? 'SMTP tidak mengonfirmasi penerimaan.',
                                canResend: !problem.events.length && problem.attemptCount < 2
                            }))
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 67,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 66,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.tsx",
        lineNumber: 47,
        columnNumber: 10
    }, this);
}
function ClickList({ id, title, note, people }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "admin-panel",
        id: id,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "panel-heading",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: [
                                title,
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "count-pill",
                                    children: people.length
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 80,
                                    columnNumber: 99
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 80,
                            columnNumber: 87
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: note
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 80,
                            columnNumber: 155
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 80,
                    columnNumber: 82
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 80,
                columnNumber: 51
            }, this),
            people.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "table-scroll",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        children: "Kontak"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 81,
                                        columnNumber: 70
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        children: "No HP"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 81,
                                        columnNumber: 85
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        children: "Kota"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 81,
                                        columnNumber: 99
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        children: "Jam klik (WIB)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 81,
                                        columnNumber: 112
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 81,
                                columnNumber: 66
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 81,
                            columnNumber: 59
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: people.map((person)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: [
                                                person.name,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    className: "table-detail",
                                                    children: person.email
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 216
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 81,
                                            columnNumber: 199
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: person.phone || '—'
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 81,
                                            columnNumber: 275
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: person.city || '—'
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 81,
                                            columnNumber: 305
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: person.time
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 81,
                                            columnNumber: 334
                                        }, this)
                                    ]
                                }, person.id, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 81,
                                    columnNumber: 179
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 81,
                            columnNumber: 148
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 81,
                    columnNumber: 52
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 81,
                columnNumber: 22
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Belum ada klik hari ini."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 81,
                columnNumber: 388
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.tsx",
        lineNumber: 80,
        columnNumber: 10
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/dashboard/problem-list.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/dashboard/problem-list.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/dashboard/problem-list.tsx", "default");
}),
"[project]/app/dashboard/problem-list.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$problem$2d$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/dashboard/problem-list.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$problem$2d$list$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/domain.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$recipient$2d$eligibility$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/birthday-recipient-eligibility.ts [app-rsc] (ecmascript)");
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
    const correctedDomain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$recipient$2d$eligibility$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["correctMailDomain"])(domain);
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
}),
"[project]/src/generated/prisma/internal/prismaNamespace.ts [app-rsc] (ecmascript) <export * as Prisma .join>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Prisma",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/generated/prisma/internal/prismaNamespace.ts [app-rsc] (ecmascript)");
}),
"[project]/src/generated/prisma/internal/prismaNamespace.ts [app-rsc] (ecmascript) <export * as Prisma .sql>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Prisma",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/generated/prisma/internal/prismaNamespace.ts [app-rsc] (ecmascript)");
}),
"[project]/src/lib/birthday-dispatch-queue.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "birthdaysSendingOn",
    ()=>birthdaysSendingOn,
    "buildBirthdayDispatchRows",
    ()=>buildBirthdayDispatchRows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/domain.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$recipient$2d$eligibility$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/birthday-recipient-eligibility.ts [app-rsc] (ecmascript)");
;
;
function birthdaysSendingOn(todayIso, offsetDays) {
    return offsetDays.flatMap((offset)=>{
        const birthday = new Date(Date.parse(`${todayIso}T00:00:00.000Z`) - offset * 86_400_000);
        const year = birthday.getUTCFullYear();
        const month = birthday.getUTCMonth() + 1;
        const day = birthday.getUTCDate();
        const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        return month === 2 && day === 28 && !leap ? [
            [
                2,
                28
            ],
            [
                2,
                29
            ]
        ] : [
            [
                month,
                day
            ]
        ];
    });
}
function buildBirthdayDispatchRows(customers, campaigns, now = new Date()) {
    return customers.flatMap((customer)=>{
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$recipient$2d$eligibility$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isUsableBirthdayEmail"])(customer.email)) return [];
        return campaigns.flatMap((campaign)=>{
            const schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$domain$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["birthdaySchedule"])(customer.birthDate.toISOString().slice(0, 10), campaign.sendOffsetDays, now);
            if (!schedule) return [];
            const time = campaign.sendTime.toISOString().slice(11, 16);
            return [
                {
                    customerId: customer.id,
                    campaignId: campaign.id,
                    promoId: campaign.promoId ?? null,
                    birthdayYear: schedule.birthdayYear,
                    scheduledAt: new Date(`${schedule.date}T${time}:00+07:00`)
                }
            ];
        });
    });
}
}),
"[project]/src/lib/birthday-forecast.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "forecastSends",
    ()=>forecastSends
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$generated$2f$prisma$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/generated/prisma/client.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Prisma__$2e$sql$3e$__ = __turbopack_context__.i("[project]/src/generated/prisma/internal/prismaNamespace.ts [app-rsc] (ecmascript) <export * as Prisma .sql>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Prisma__$2e$join$3e$__ = __turbopack_context__.i("[project]/src/generated/prisma/internal/prismaNamespace.ts [app-rsc] (ecmascript) <export * as Prisma .join>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$dispatch$2d$queue$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/birthday-dispatch-queue.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$recipient$2d$eligibility$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/birthday-recipient-eligibility.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function forecastSends(fromIso, toIso) {
    if (fromIso > toIso) return [];
    const days = [];
    for(let time = Date.parse(`${fromIso}T00:00:00.000Z`); time <= Date.parse(`${toIso}T00:00:00.000Z`); time += 86_400_000)days.push(new Date(time).toISOString().slice(0, 10));
    const campaigns = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].campaign.findMany({
        where: {
            status: 'active'
        },
        select: {
            id: true,
            name: true,
            whatsappPhone: true,
            sendOffsetDays: true,
            sendTime: true
        }
    });
    if (!campaigns.length) return [];
    const birthdays = [
        ...new Set(days.flatMap((day)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$dispatch$2d$queue$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["birthdaysSendingOn"])(day, campaigns.map((campaign)=>campaign.sendOffsetDays))).map(([month, day])=>`${month}-${day}`))
    ].map((pair)=>pair.split('-').map(Number));
    const customers = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].$queryRaw(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Prisma__$2e$sql$3e$__["Prisma"].sql`
    SELECT id, full_name, email, birth_date, source FROM customers
    WHERE is_active = true AND is_blacklisted = false AND source NOT IN (${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Prisma__$2e$join$3e$__["Prisma"].join(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$recipient$2d$eligibility$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testSources"])})
      AND (EXTRACT(MONTH FROM birth_date)::int, EXTRACT(DAY FROM birth_date)::int) IN (${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Prisma__$2e$join$3e$__["Prisma"].join(birthdays.map(([month, day])=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$generated$2f$prisma$2f$internal$2f$prismaNamespace$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Prisma__$2e$sql$3e$__["Prisma"].sql`(${month}::int, ${day}::int)`))})
  `);
    if (!customers.length) return [];
    const key = (row)=>`${row.campaignId}:${row.customerId}:${row.birthdayYear}`;
    const existing = new Set((await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].birthdayDispatch.findMany({
        where: {
            customerId: {
                in: customers.map((customer)=>customer.id)
            }
        },
        select: {
            campaignId: true,
            customerId: true,
            birthdayYear: true
        }
    })).map(key));
    const customerById = new Map(customers.map((customer)=>[
            customer.id,
            customer
        ]));
    const campaignById = new Map(campaigns.map((campaign)=>[
            campaign.id,
            campaign
        ]));
    const until = new Date(Date.parse(`${toIso}T00:00:00+07:00`) + 86_400_000);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$birthday$2d$dispatch$2d$queue$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildBirthdayDispatchRows"])(customers.map((customer)=>({
            id: customer.id,
            email: customer.email,
            birthDate: customer.birth_date
        })), campaigns, new Date(`${fromIso}T00:00:00+07:00`)).filter((row)=>row.scheduledAt < until && !existing.has(key(row))).map((row)=>({
            ...row,
            customer: customerById.get(row.customerId),
            campaign: campaignById.get(row.campaignId)
        }));
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/birthday-recipient-eligibility.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/lib/csv.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// CSV for Excel: UTF-8 BOM, CRLF, quoted where needed. A cell starting with = + - @ (or tab/CR) gets a leading '
// so a spreadsheet never runs it as a formula.
__turbopack_context__.s([
    "displayPhone",
    ()=>displayPhone,
    "toCsv",
    ()=>toCsv
]);
function toCsv(rows) {
    const cell = (value)=>{
        let text = value === null || value === undefined ? '' : String(value);
        if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
        return /[",;\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    return `﻿${rows.map((row)=>row.map(cell).join(',')).join('\r\n')}\r\n`;
}
function displayPhone(phone) {
    if (!phone) return '';
    const local = phone.startsWith('+62') ? `0${phone.slice(3)}` : phone;
    return local.replace(/(\d{4})(?=\d)/g, '$1 ');
}
}),
]})(),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/dashboard/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/app/dashboard/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__07zetwtzwp0wo._.js.map