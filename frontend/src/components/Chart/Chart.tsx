import React, { useRef, useState, useEffect, Dispatch } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../types';
import { SerializedChart, Position, positionSubtract, positionSum } from 'flowcharts-common';
import { PlanChart } from './implementation/PlanChart';
import { deserializeChart } from './chartDeserializer';
import { ChartAction } from '../../reducers/chart';
import { SELECT_NODE, UNSELECT_NODE } from '../../types/actions';
import { PlanNode } from './implementation/PlanNode';

type ChartComponentProperties = {
    chart: SerializedChart,
    onChartClickEvent?: () => any,
    onNodeClickEvent?: (nodeId: string) => any,
    svgWidth: number,
    selectedNode?: string,
    selectedNodePosition?: Position,

    selectNode: (node: string, position?: Position) => void,
    unselectNode: () => void,
};


const mapStateToProps = (state: AppState) => ({
    selectedNode: state.chart.selectedNode,
    selectedNodePosition: state.chart.selectedNodePosition,
});

const mapDispatchToProps = (dispatch: Dispatch<ChartAction>) => ({
    selectNode: (node: string, position?: Position) => dispatch({ type: SELECT_NODE, node, position }),
    unselectNode: () => dispatch({ type: UNSELECT_NODE }),
});

const ChartComponent = (props: ChartComponentProperties) => {
    const svgRef = useRef(null as SVGSVGElement | null);

    const [chart, updateChart] = useState(undefined as PlanChart | undefined);

    const [dragStart, updateDragStart] = useState(undefined as Position | undefined);
    const [dragOffset, updateDragOffset] = useState({ x: 0, y: 0 });
    const [prevDragOffset, updatePrevDragOffset] = useState({ x: 0, y: 0 });

    useEffect(() => setSvgProps(svgRef.current, props.svgWidth), [svgRef]);

    useEffect(() => {
        if (svgRef.current === null) {
            return;
        }

        if (chart !== undefined) {
            chart.clear();
        }

        const newChart = deserializeChart(props.chart, svgRef.current);
        newChart.draw();

        if (props.selectedNode !== undefined) {
            // update selected node position after re-render
            const position = getNodePosition(newChart, props.selectedNode);

            if (position !== undefined) {
                props.selectNode(props.selectedNode, positionSum(position, dragOffset));
            }
        }

        updateChart(newChart);
    }, [props.chart]);

    useEffect(() => {
        if (chart !== undefined) {
            chart.nodeClickHandler = (node: PlanNode) => {
                const position = node.view?.pos;
                if (position !== undefined) {
                    console.log('drag offset', dragOffset);
                    console.log('position is', positionSum(position, dragOffset));
                    props.selectNode(node.id, positionSum(position, dragOffset));
                }
            };
        }
    }, [dragOffset, chart]);

    const onChartMouseDown = (position: Position) => {
        updateDragStart(position);
        props.unselectNode();
    };

    const updateDragOffsetWithMousePosition = (position: Position) => {
        if (dragStart === undefined) {
            // drag is not in progress
            return;
        }

        updateDragOffset(positionSum(positionSubtract(position, dragStart), prevDragOffset));
    };

    const stopDrag = () => {
        updateDragStart(undefined);
        updatePrevDragOffset(dragOffset);
    };

    const backgroundStyles = props.chart.style.background !== undefined ? {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), 
                url(https://planmaps_assets.nikitavbv.com/background/${props.chart.style.background})`,
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    } : {};

    return (
        <div
            style={{
                width: '100%',
                cursor: dragStart !== undefined ? 'grab' : undefined,
                ...backgroundStyles
            }}
            onMouseDown={wrapMouseEventHandler(onChartMouseDown)}
            onMouseMove={wrapMouseEventHandler(updateDragOffsetWithMousePosition)}
            onMouseUp={stopDrag}>
            <svg
                ref={svgRef}
                className="plan-chart-svg"
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                style={{ userSelect: 'none' }}>

                <defs>
                    <style>
                        @import url("https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i");
                    </style>
                </defs>

                <g className='treeRootGroup'
                   transform={`translate(${dragOffset.x}, ${dragOffset.y})`}>
                    <rect className="svg-bg" width="100%" height="100%" fill="transparent"/>
                    <g className="connectors"/>
                </g>
            </svg>
        </div>
    );
};

const getNodePosition = (chart: PlanChart, nodeId: string): Position | undefined =>
    chart.innerNodes().filter(node => node.id === nodeId)[0]?.view?.pos;

const wrapMouseEventHandler = <T extends HTMLElement> (handler: (pos: Position) => void) =>
    (e: React.MouseEvent<T, MouseEvent>) => handler({ x: e.screenX, y: e.screenY });

export const Chart = connect(mapStateToProps, mapDispatchToProps)(ChartComponent);

const setSvgProps = (svgElem: SVGSVGElement | null, svgWidth: number) => {
    const menuHeight = 60;
    const svgHeight = document.body.offsetHeight - menuHeight;

    if (svgElem === null) {
        return;
    }

    svgElem.setAttribute('width', svgWidth.toString() + 'px');
    svgElem.setAttribute('height', svgHeight.toString() + 'px');
};
