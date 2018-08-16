import React from "react";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import {OnToggleSwitch} from "../../utils/formElemUtil";
import $ from "jquery";
//var mCustomScrollbar = require('malihu-custom-scrollbar-plugin');
export default class MlTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleExpand = this.handleExpand.bind(this);
    this.state = {expandingContentId: []};
  }

  componentDidMount(){
    OnToggleSwitch(true,true);
   // var self = this;
   // mCustomScrollbar($);
   // $(".react-bs-container-body").mCustomScrollbar({scrollbarPosition:'outside',alwaysShowScrollbar:0});
   //   self.forceUpdate();
  }
  componentDidUpdate(){
    OnToggleSwitch(true,true);
  }
  componentWillUpdate(nextProps){
  //  $(".react-bs-container-body").mCustomScrollbar({scrollbarPosition:'outside',alwaysShowScrollbar:0});
  }

  handleExpand(rowKey, isExpand) {
    if (isExpand&&this.props.asyncExpand) {
      this.setState({expandingContentId:[rowKey]});
    }else if(this.props.asyncExpand){
      this.setState({expandingContentId:[]});
    }
  }

  render() {
    const selectRow = {
      mode: 'checkbox',
      bgColor: this.props.bgColor?this.props.bgColor:'#ffe144',
      onSelect: this.props.handleRowSelect,
      clickToExpand: this.props.isExpandableRow?true:false,
      onSelectAll: this.props.handleRowSelectAll,
      clickToSelect: true
    };
    var WinHeight = $(window).height();
    var tblHeight = WinHeight-(125+$('.admin_header').outerHeight(true));
    let searchEnable = true
    if(this.props.filter){
      searchEnable = false
    }else{
      searchEnable = true
    }
    const config = {tableHeaderClass:this.props.tableHeaderClass,
                    trClassName:this.props.trClassName||'',
                    maxHeight: tblHeight+'px',
                    striped:true,hover:true,
                    selectRow:(this.props.selectRow?selectRow:{}) ,
                    data:this.props.data,
                    remote:true,
                    search:searchEnable,multiColumnSearch:true,pagination:this.props.pagination,
                    fetchInfo:{ dataTotalSize: this.props.totalDataSize }
                   };
   //Note: you can pass the functions for expandRow and expandComponent as properties.
    if(this.props.isExpandableRow&&this.props.expandComponent){
      //TODO: pass this as the props
      const expandableRow=(row)=> {return true};
      //TODO: pass this as the props
      const CustomExpandComponent = this.props.expandComponent;
      const expandComponent=(row)=> {
        if(this.props.asyncExpand){
          if (this.state.expandingContentId.indexOf(row[this.props.asyncExpandRowKey]) === -1) {
          } else {
            return <CustomExpandComponent data={row} />;
          }
        }else{
          return <CustomExpandComponent data={row} />;
        }// return <CustomExpandComponent data={row} />;
      };
      config['expandComponent']=expandComponent;
      config['expandableRow']=expandableRow;
    };

     config['options']={sizePerPage:this.props.sizePerPage,
      sizePerPageList: [10,20,50,100],
      page: this.props.pageNumber,
      onPageChange: this.props.onPageChange,
      onSizePerPageList: this.props.onSizePerPageList,
      onSortChange:this.props.onSortChange,
      onSearchChange:this.props.onSearchChange,
      clearSearch: false,
      onlyOneExpanding:true,
      expandRowBgColor:this.props.expandRowBgColor?this.props.expandRowBgColor:'#fff',
      onExpand: this.handleExpand
      };

    const columnItems = this.props.columns.map((cl) =>{
      let columnOptions = {
        key: cl.dataField,
        dataField: cl.dataField,
        headerTitle: false,
        columnTitle: true,
        hidden: (cl.isHidden ? cl.isHidden : false),
        isKey: (cl.isKey ? cl.isKey : false),
        dataSort: (cl.dataSort ? cl.dataSort : false)
      };
      if(cl.customComponent){
        let CustomComponent = cl.customComponent;
        let customColumnComponent=(cell,row)=> {
          return <CustomComponent data={row} />;
        };

        let useCustomComponent=cl.useCustomComponent;
        if(useCustomComponent){customColumnComponent=CustomComponent};

        columnOptions['dataFormat']=customColumnComponent;
       // if(cl.width){
        // columnOptions['width']='10%';
       // }
      }

      if(cl.customTitleFormatter){
        columnOptions['columnTitle']=cl.customTitleFormatter;
      }
      return <TableHeaderColumn {...columnOptions}>{cl.title}</TableHeaderColumn>;
    });

    return (
       <BootstrapTable {...config} bodyStyle={{overflow: 'overlay','overflowX':'hidden'}}>
                {columnItems}
       </BootstrapTable>
    );
  }
}
