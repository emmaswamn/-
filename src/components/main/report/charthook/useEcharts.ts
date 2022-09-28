import * as echarts from 'echarts/core';
import {
    BarChart,
    // 系列类型的定义后缀都为 SeriesOption
    LineChart
} from 'echarts/charts';
import {
    TitleComponent,
    // 组件类型的定义后缀都为 ComponentOption
    TooltipComponent,
    GridComponent,
    // 数据集组件
    DatasetComponent,
    LegendComponent,
    // 内置数据转换器组件 (filter, sort)
    TransformComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { ElMessage } from 'element-plus';
import { getReports } from '@/api/reports'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent
]);


export async function init() {
    const myChart = echarts.init(document.getElementById('main') as HTMLElement);
          // 指定图表的配置项和数据

    const   options = {
        title: {
            text: '用户来源'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                backgroundColor: '#E9EEF3'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                boundaryGap: false
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ]
    }

    const res:any = await getReports();
    if(res.meta.status !== 200){
        ElMessage.error('获取报表失败');
    }

    const option = {...options, ...res.data}

    myChart.setOption(option);
}