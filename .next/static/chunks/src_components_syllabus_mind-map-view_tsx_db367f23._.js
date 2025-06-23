(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/syllabus/mind-map-view.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>MindMapView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ReactFlow__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript) <export ReactFlow as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$controls$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/controls/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$background$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/background/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const nodeWidth = 200;
const nodeHeight = 50; // Estimated height, actual might vary
const verticalGap = 20;
const horizontalGap = 280;
// A recursive function to lay out the nodes in a tree structure.
const generateLayout = (topics, level = 0, yOffset = 0, parent = null)=>{
    const allNodes = [];
    const allEdges = [];
    let currentY = yOffset;
    topics.forEach((topic)=>{
        const nodeId = topic.id;
        // First, process children to get their layout and total height
        let subTreeHeight = 0;
        if (topic.subtopics && topic.subtopics.length > 0) {
            const { nodes: childNodes, edges: childEdges, height } = generateLayout(topic.subtopics, level + 1, currentY, topic);
            allNodes.push(...childNodes);
            allEdges.push(...childEdges);
            subTreeHeight = height;
        }
        // Now, position the current node.
        // It's placed vertically in the middle of the area its children occupy.
        const nodeX = level * horizontalGap;
        const nodeY = currentY + (subTreeHeight > 0 ? subTreeHeight / 2 - nodeHeight / 2 : 0);
        allNodes.push({
            id: nodeId,
            data: {
                label: topic.title
            },
            position: {
                x: nodeX,
                y: nodeY
            },
            type: 'default',
            style: {
                width: nodeWidth,
                textAlign: 'center',
                fontSize: '12px',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))'
            },
            sourcePosition: 'right',
            targetPosition: 'left'
        });
        // Add edge from parent to the current node
        if (parent) {
            allEdges.push({
                id: `e-${parent.id}-${nodeId}`,
                source: parent.id,
                target: nodeId,
                type: 'smoothstep'
            });
        }
        // The Y for the next sibling starts after the current node's subtree
        currentY += Math.max(nodeHeight, subTreeHeight) + verticalGap;
    });
    const totalHeight = currentY - yOffset - (topics.length > 0 ? verticalGap : 0);
    return {
        nodes: allNodes,
        edges: allEdges,
        height: totalHeight
    };
};
const fitViewOptions = {
    padding: 0.2
};
const defaultEdgeOptions = {};
function MindMapView({ data }) {
    _s();
    const { nodes: initialNodes, edges: initialEdges } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MindMapView.useMemo": ()=>generateLayout(data)
    }["MindMapView.useMemo"], [
        data
    ]);
    const [nodes, setNodes] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(initialNodes);
    const [edges, setEdges] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(initialEdges);
    const onNodesChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MindMapView.useCallback[onNodesChange]": (changes)=>setNodes({
                "MindMapView.useCallback[onNodesChange]": (nds)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNodeChanges"])(changes, nds)
            }["MindMapView.useCallback[onNodesChange]"])
    }["MindMapView.useCallback[onNodesChange]"], [
        setNodes
    ]);
    const onEdgesChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MindMapView.useCallback[onEdgesChange]": (changes)=>setEdges({
                "MindMapView.useCallback[onEdgesChange]": (eds)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyEdgeChanges"])(changes, eds)
            }["MindMapView.useCallback[onEdgesChange]"])
    }["MindMapView.useCallback[onEdgesChange]"], [
        setEdges
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "MindMapView.useEffect": ()=>{
            // Recalculate layout if data changes
            const { nodes: newNodes, edges: newEdges } = generateLayout(data);
            setNodes(newNodes);
            setEdges(newEdges);
        }
    }["MindMapView.useEffect"], [
        data
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-[75vh] w-full rounded-lg border bg-background",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ReactFlow__as__default$3e$__["default"], {
            nodes: nodes,
            edges: edges,
            onNodesChange: onNodesChange,
            onEdgesChange: onEdgesChange,
            fitView: true,
            fitViewOptions: fitViewOptions,
            defaultEdgeOptions: defaultEdgeOptions,
            proOptions: {
                hideAttribution: true
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$controls$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Controls"], {}, void 0, false, {
                    fileName: "[project]/src/components/syllabus/mind-map-view.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$background$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Background"], {}, void 0, false, {
                    fileName: "[project]/src/components/syllabus/mind-map-view.tsx",
                    lineNumber: 141,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/syllabus/mind-map-view.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/syllabus/mind-map-view.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_s(MindMapView, "LZWdRmCBU5gNRhxtsktXPjgC5jQ=");
_c = MindMapView;
var _c;
__turbopack_context__.k.register(_c, "MindMapView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/syllabus/mind-map-view.tsx [app-client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/syllabus/mind-map-view.tsx [app-client] (ecmascript)"));
}}),
}]);

//# sourceMappingURL=src_components_syllabus_mind-map-view_tsx_db367f23._.js.map