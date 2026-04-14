import { useState, useRef } from 'react';
import { Maximize2, Minimize2, Download, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';
import toast from 'react-hot-toast';

const branchColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4'];

const MindMapVisualization = ({ mindMapData }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const svgRef = useRef(null);

    if (!mindMapData || !mindMapData.branches) {
        return (
            <div className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed">
                <p className="text-gray-500">No mind map data</p>
            </div>
        );
    }

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
    const zoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
    const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));

    const downloadPNG = async () => {
        if (!svgRef.current) return;
        try {
            const url = await toPng(svgRef.current, { backgroundColor: '#f8fafc', pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `mindmap-${mindMapData.centralTopic || 'export'}.png`;
            link.href = url;
            link.click();
            toast.success('Downloaded!');
        } catch (e) {
            toast.error('Download failed');
        }
    };

    const branches = mindMapData.branches;
    const cx = 350, cy = 280, r = 160;

    return (
        <>
            {/* Fullscreen overlay */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col">
                    {/* Fullscreen header */}
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800">
                        <h3 className="font-bold text-lg">🧠 {mindMapData.centralTopic}</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={zoomOut}><ZoomOut className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm" onClick={zoomIn}><ZoomIn className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm" onClick={downloadPNG}><Download className="w-4 h-4 mr-1" />PNG</Button>
                            <Button variant="destructive" size="sm" onClick={toggleFullscreen}><X className="w-4 h-4 mr-1" />Close</Button>
                        </div>
                    </div>
                    {/* Fullscreen content */}
                    <div ref={svgRef} className="flex-1 overflow-auto flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
                        <svg
                            viewBox="0 0 700 560"
                            style={{ transform: `scale(${zoom})`, width: '90vw', height: '80vh' }}
                        >
                            <defs>
                                <filter id="shadowFull"><feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.25" /></filter>
                                <linearGradient id="centerGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                            {/* Lines */}
                            {branches.map((b, i) => {
                                const angle = (2 * Math.PI * i) / branches.length - Math.PI / 2;
                                const ex = cx + r * Math.cos(angle), ey = cy + r * Math.sin(angle);
                                return <line key={`l${i}`} x1={cx} y1={cy} x2={ex} y2={ey} stroke={branchColors[i % branchColors.length]} strokeWidth="3" opacity="0.7" />;
                            })}
                            {/* Center */}
                            <circle cx={cx} cy={cy} r="65" fill="url(#centerGradFull)" filter="url(#shadowFull)" />
                            <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{mindMapData.centralEmoji || '🧠'}</text>
                            <text x={cx} y={cy + 15} textAnchor="middle" fill="white" fontSize="10">{(mindMapData.centralTopic || '').slice(0, 18)}</text>
                            {/* Branches */}
                            {branches.map((b, i) => {
                                const angle = (2 * Math.PI * i) / branches.length - Math.PI / 2;
                                const x = cx + r * Math.cos(angle), y = cy + r * Math.sin(angle);
                                const color = branchColors[i % branchColors.length];
                                return (
                                    <g key={`b${i}`}>
                                        <rect x={x - 50} y={y - 20} width="100" height="40" rx="8" fill={color} filter="url(#shadowFull)" />
                                        <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">{(b.topic || '').slice(0, 12)}</text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>
            )}

            {/* Normal view */}
            <div className="relative h-96 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border overflow-hidden">
                {/* Toolbar */}
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-white dark:bg-gray-800" onClick={zoomOut}><ZoomOut className="w-3 h-3" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-white dark:bg-gray-800" onClick={zoomIn}><ZoomIn className="w-3 h-3" /></Button>
                    <Button variant="outline" size="sm" className="h-8 bg-white dark:bg-gray-800" onClick={downloadPNG}><Download className="w-3 h-3 mr-1" />PNG</Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-white dark:bg-gray-800" onClick={toggleFullscreen}><Maximize2 className="w-3 h-3" /></Button>
                </div>

                {/* SVG */}
                <div ref={!isFullscreen ? svgRef : undefined} className="w-full h-full flex items-center justify-center p-4">
                    <svg
                        viewBox="0 0 700 560"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ transform: `scale(${zoom})`, maxWidth: '100%', maxHeight: '100%' }}
                        className="transition-transform"
                    >
                        <defs>
                            <filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.25" /></filter>
                            <linearGradient id="centerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>

                        {/* Connection lines */}
                        {branches.map((branch, i) => {
                            const angle = (2 * Math.PI * i) / branches.length - Math.PI / 2;
                            const endX = cx + r * Math.cos(angle);
                            const endY = cy + r * Math.sin(angle);
                            const color = branchColors[i % branchColors.length];
                            return (
                                <line
                                    key={`line-${i}`}
                                    x1={cx} y1={cy} x2={endX} y2={endY}
                                    stroke={color} strokeWidth="3" opacity="0.7"
                                />
                            );
                        })}

                        {/* Central node */}
                        <circle cx={cx} cy={cy} r="65" fill="url(#centerGrad)" filter="url(#shadow)" />
                        <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                            {mindMapData.centralEmoji || '🧠'}
                        </text>
                        <text x={cx} y={cy + 15} textAnchor="middle" fill="white" fontSize="11">
                            {(mindMapData.centralTopic || '').substring(0, 18)}
                        </text>

                        {/* Branch nodes */}
                        {branches.map((branch, i) => {
                            const angle = (2 * Math.PI * i) / branches.length - Math.PI / 2;
                            const x = cx + r * Math.cos(angle);
                            const y = cy + r * Math.sin(angle);
                            const color = branchColors[i % branchColors.length];

                            return (
                                <g key={`branch-${i}`}>
                                    <rect
                                        x={x - 50} y={y - 22}
                                        width="100" height="44"
                                        rx="10"
                                        fill={color}
                                        filter="url(#shadow)"
                                    />
                                    <text
                                        x={x} y={y + 5}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="11"
                                        fontWeight="600"
                                    >
                                        {(branch.topic || '').substring(0, 14)}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        </>
    );
};

export default MindMapVisualization;
