import React from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import 'rc-tabs/assets/index.css';

const contentStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100px',
  backgroundColor: '#fff',
};

export default class MlVerticalTabComponent extends React.Component {
  constructor(props){
    super(props)
    this.callback.bind(this)
    this.state = {tabs:props.tabs};
  }

  callback (key){
  }




  render(){
    const makeTabPane = key => (
      <TabPane tab={key} key={key}>
        <div style={contentStyle}>
          {key}
        </div>
      </TabPane>
    );

    const makeMultiTabPane = (count) => {
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(makeTabPane(i));
      }
      return result;
    };
      // const makeTabPane = (key, i) => (
      //   <TabPane tab={key.title} key={i}>
      //     {key.title}
      //   </TabPane>
      // );
      //
      // const makeMultiTabPane = (count) =>
      // {
      //   const result = [];
      //   for (let i = 0; i < this.state.tabs.lenght; i++) {
      //     result.push(makeTabPane(this.state.tabs[i], i));
      //   }
      //   return result;
      // };
      return(
        <Tabs
          defaultActiveKey="2"
          onChange={this.callback.bind(this)}
          tabBarPosition="left"
          renderTabBar={()=><ScrollableInkTabBar styles={{
            inkBar: {
              width: '20px',
              backgroundColor: 'red',
            },
          }}/>}
          renderTabContent={()=><TabContent />}
        >
          {makeMultiTabPane(11)}
        </Tabs>
      )
  }
}
