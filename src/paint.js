import React from 'react';
import StatisticBlock from './statisticBlock';

export default function paint($element, layout) {
	console.log($element, layout);
	React.render(
	  <StatisticBlock kpis={layout.kpis} options={layout.options}/>
	  ,
	  ($element)[0]
	);
}