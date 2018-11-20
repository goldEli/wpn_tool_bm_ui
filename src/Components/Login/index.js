import React, { Component } from "react";
import {
  WhiteSpace,
  WingBlank,
  InputItem,
  Button,
} from "antd-mobile";
import api from "../../api/index";
import utils from "../../utils/index";


const MAP_INPUT = {
  pwd: '密码',
  user: '账号',
}
export default class Login extends Component {
  state = {
    user: '',
    pwd: '',
  }
  handleInputOnChange = (value, label) => {
    const key = utils.findKey(MAP_INPUT, label)
    this.setState({[key]: value})
  }
  handleLogin = () => {
    const {user, pwd} = this.state
    console.log(user, pwd)
    api.login({
      success: () => {

      },
      param: {pwd, name: user}
    })
  }
  render() {
    const {user, pwd} = this.state
    const inputInfo = [
      {
        placeholder: "请输入"+MAP_INPUT.user,
        label: MAP_INPUT.user,
        value: user,
        type: 'input',
      },
      {
        placeholder: "请输入"+MAP_INPUT.pwd,
        label: MAP_INPUT.pwd,
        value: pwd,
        type: 'password',
      }
    ];
    return (
      <WingBlank size="lg">
      <WhiteSpace size="lg" />
      {
        inputInfo.map((e,i) => {
          const {type, label, value, placeholder } = e
          return (
            <InputItem
          key={i.toString()}
          type={type}
          onChange={v => this.handleInputOnChange(v, label)}
          value={value}
          placeholder={placeholder}
          clear
          moneyKeyboardAlign="right"
        >
          {label}
        </InputItem>
          )
        })
      }
        <WhiteSpace size="lg" />
        <Button onClick={this.handleLogin} type="primary">登录</Button>
        <WhiteSpace size="lg" />
      </WingBlank>
    );
  }
}
