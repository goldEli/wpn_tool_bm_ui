import React, { Component } from "react";
import {
  WhiteSpace,
  Card,
  WingBlank,
  InputItem,
  Button,
  Toast,
  Modal,
  List,
  Switch
} from "antd-mobile";
import api from "../../api/index";
import utils from "../../utils/index";

// 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
// https://github.com/ant-design/ant-design-mobile/issues/307
// https://github.com/ant-design/ant-design-mobile/issues/163
const isIPhone = new RegExp("\\biPhone\\b|\\biPod\\b", "i").test(
  window.navigator.userAgent
);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault()
  };
}
const alert = Modal.alert;

const compare = property => {
  return function(obj1, obj2) {
    var value1 = obj1[property];
    var value2 = obj2[property];
    return value1 - value2;
  };
};

const clone = obj => {
  return JSON.parse(JSON.stringify(obj));
};

const MAP_LABEL = {
  checked: "是否发布",
  index: "排序",
  name: "名称",
  spec: "规格",
  price: "价格",
  unit: "单位",
  src: "图片地址"
};

class Home extends Component {
  state = {
    goodsList: []
  };
  componentDidMount() {
    this.setData()
  }
  setData = () => {
    api.queryAllGoods({
      success: data => {
        const d = data.sort(compare("index"))
        d.forEach(e => {
          e.checked = e.checked ? true : false
        })
        this.setState({goodsList: d})
      }
    })
  }
  handleInputOnChange = (value, id, label) => {
    const { goodsList } = this.state;
    const list = clone(goodsList);
    const key = utils.findKey(MAP_LABEL, label);
    list.forEach(e => {
      if (e.id === id) {
        e[key] = value;
      }
    });
    this.setState({ goodsList: list });
  };
  // handleSaveWhenChangeIndex = (index) => {
  //   const {goodsList} = this.state;
  //   const list = goodsList.filter(e => e.index === index)
  //   if (list.length === 2) {

  //   }
  // }
  handleSave = (id) => {
    const {goodsList} = this.state;
    const param = goodsList.filter(e => e.id === id)[0]
    param.checked = param.checked ? 1 : 0;
    if (typeof id === 'number') {
      api.addGoods({
        success: data => {
          Toast.success("保存成功", 1);
          this.setData()
        },
        param: param
      });
      return 
    }
    api.updateGoods({
      success: data => {
        Toast.success("保存成功", 1);
        this.setData()
      },
      param: param
    });
  };
  handleDel = (id) => {
    alert("删除", "删除将不可恢复！", [
      { text: "取消", onPress: () => {} },
      { text: "确定", onPress: () => {
        api.delGoods({
          success: data => {
            Toast.success("删除成功!", 1);
            this.setData()
          },
          param: {id}
        })
      } }
    ]);
  };
  addAll = () => {
    const {goodsList} = this.state;
    goodsList.map((e,i) => {
      e.checked = e.checked ? 1 : 0
      api.addGoods({
        success: data => {
          console.log(data);
        },
        param: e
      });
    })
  }
  handleAdd = () => {
    const { goodsList } = this.state;
    const list = clone(goodsList);
    const index = list.length + 1;
    list.push({
      index,
      name: "新商品",
      price: 27,
      unit: "袋",
      spec: "500g",
      id: index,
      src: "",
      checked: true
    });
    this.setState({ goodsList: list });
  };
  render() {
    const { goodsList } = this.state;
    return (
      <WingBlank size="lg">
        {goodsList.map(e => {
          const { name, src, unit, price, index, id, spec, checked } = e;
          const inputInfo = [
            {
              placeholder: "不能超过" + goodsList.length,
              label: MAP_LABEL.index,
              value: index
            },
            {
              placeholder: "请输入" + MAP_LABEL.name,
              label: MAP_LABEL.name,
              value: name
            },
            {
              placeholder: "请输入" + MAP_LABEL.spec,
              label: MAP_LABEL.spec,
              value: spec
            },
            {
              placeholder: "请输入" + MAP_LABEL.price,
              label: MAP_LABEL.price,
              value: price
            },
            {
              placeholder: "请输入" + MAP_LABEL.unit,
              label: MAP_LABEL.unit,
              value: unit
            },
            {
              placeholder: "请输入" + MAP_LABEL.src,
              label: MAP_LABEL.src,
              value: src
            }
          ];
          return (
            <div key={id} style={{ width: "100%" }}>
              <Card>
                <Card.Header title={name} />
                <Card.Body>
                  <img src={src} alt="图片地址不正确" style={{width:"100%"}}/>
                  <List.Item
                    extra={
                      <Switch
                        checked={checked}
                        onChange={e =>
                          this.handleInputOnChange(e, id, MAP_LABEL.checked)
                        }
                      />
                    }
                  >
                    {MAP_LABEL.checked}
                  </List.Item>
                  {inputInfo.map((ee, ii) => {
                    const { placeholder, label, value } = ee;
                    return (
                      <InputItem
                        key={ii.toString()}
                        type={"input"}
                        onChange={e => this.handleInputOnChange(e, id, label)}
                        value={value}
                        placeholder={placeholder}
                        clear
                        moneyKeyboardAlign="right"
                        moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                      >
                        {label}
                      </InputItem>
                    );
                  })}
                  <Button type="warning" onClick={e => this.handleDel(id)}>
                    删除
                  </Button>
                  <WhiteSpace size="lg" />
                  <Button type="primary" onClick={e => this.handleSave(id)}>
                    保存
                  </Button>
                </Card.Body>
              </Card>
              <WhiteSpace size="lg" />
            </div>
          );
        })}
        <WhiteSpace size="lg" />
        <Button onClick={this.handleAdd}>新增</Button>
        <WhiteSpace size="lg" />
      </WingBlank>
    );
  }
}

export default Home;
