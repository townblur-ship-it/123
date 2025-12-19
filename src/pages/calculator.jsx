// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, RadioGroup, RadioGroupItem, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { Calculator, TrendingUp, DollarSign, Calendar, FileText, Users, Wallet, PiggyBank } from 'lucide-react';

export default function ProfitCalculator(props) {
  const {
    $w,
    style
  } = props;
  const [budget, setBudget] = useState('');
  const [profitRate, setProfitRate] = useState('15');
  const [cost, setCost] = useState(0);
  const [annualCost, setAnnualCost] = useState(0);
  const [baseSalary, setBaseSalary] = useState('7460');
  const [otherCostBonus, setOtherCostBonus] = useState('0');
  const [socialSecurityCost, setSocialSecurityCost] = useState(0);
  const [cash, setCash] = useState(0);
  const [preTaxSalary, setPreTaxSalary] = useState(0);

  // 基础工资选项
  const salaryOptions = [{
    label: '上海7460',
    value: '7460'
  }, {
    label: '沈阳4500',
    value: '4500'
  }, {
    label: '北京7162',
    value: '7162'
  }, {
    label: '其他5000',
    value: '5000'
  }, {
    label: '其他8500',
    value: '8500'
  }];

  // 页面加载时获取URL参数，用于恢复之前的状态
  useEffect(() => {
    const params = $w.page.dataset.params;
    if (params && Object.keys(params).length > 0) {
      // 如果有传递的预算金额，则恢复
      if (params.budget) {
        setBudget(params.budget);
      }
      // 如果有传递的利润率，则恢复
      if (params.profitRate) {
        setProfitRate(params.profitRate);
      }
    }
  }, [$w.page.dataset.params]);
  useEffect(() => {
    if (budget && !isNaN(budget) && profitRate) {
      const budgetValue = parseFloat(budget);
      const rate = parseFloat(profitRate) / 100;
      const calculatedCost = budgetValue * (1 - rate);
      setCost(calculatedCost);

      // 计算年支付成本总额：综合成本上限 × 233 ÷ 1.2
      const calculatedAnnualCost = calculatedCost * 233 / 1.2;
      setAnnualCost(calculatedAnnualCost);
    } else {
      setCost(0);
      setAnnualCost(0);
    }
  }, [budget, profitRate]);
  useEffect(() => {
    // 计算含社保成本：基础工资 × 1.4
    if (baseSalary && !isNaN(baseSalary)) {
      const calculatedSocialSecurityCost = parseFloat(baseSalary) * 1.4;
      setSocialSecurityCost(calculatedSocialSecurityCost);
    } else {
      setSocialSecurityCost(0);
    }
  }, [baseSalary]);
  useEffect(() => {
    // 计算现金：(年支付成本 - 其他成本奖金 - 2000) ÷ 12 - 含社保成本
    if (annualCost > 0 && !isNaN(otherCostBonus)) {
      const otherCostBonusValue = parseFloat(otherCostBonus) || 0;
      const calculatedCash = (annualCost - otherCostBonusValue - 2000) / 12 - socialSecurityCost;
      setCash(calculatedCash);
    } else {
      setCash(0);
    }
  }, [annualCost, otherCostBonus, socialSecurityCost]);
  useEffect(() => {
    // 计算税前工资：现金 + 基本工资
    if (baseSalary && !isNaN(baseSalary)) {
      const baseSalaryValue = parseFloat(baseSalary);
      const calculatedPreTaxSalary = cash + baseSalaryValue;
      setPreTaxSalary(calculatedPreTaxSalary);
    } else {
      setPreTaxSalary(0);
    }
  }, [cash, baseSalary]);
  const handleBudgetChange = e => {
    const value = e.target.value;
    if (value === '' || !isNaN(value) && parseFloat(value) >= 0) {
      setBudget(value);
    }
  };
  const handleOtherCostBonusChange = e => {
    const value = e.target.value;
    if (value === '' || !isNaN(value) && parseFloat(value) >= 0) {
      setOtherCostBonus(value);
    }
  };
  const formatCurrency = amount => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount);
  };
  const handleNavigateToLaborContract = () => {
    // 传递计算数据到劳动合同页面
    $w.utils.navigateTo({
      pageId: 'labor-contract',
      params: {
        budget,
        profitRate,
        cost,
        annualCost,
        baseSalary,
        otherCostBonus,
        socialSecurityCost,
        cash,
        preTaxSalary
      }
    });
  };
  const handleNavigateToDailyRate = () => {
    // 传递计算数据到人天报价页面
    $w.utils.navigateTo({
      pageId: 'daily-rate',
      params: {
        budget,
        profitRate,
        cost,
        annualCost
      }
    });
  };
  return <div style={style} className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">顾问成本计算器</h1>
          <p className="text-gray-600">输入客户预算和利润率，快速计算综合成本上限和年支付成本总额</p>
        </div>

        {/* 上部分：前四列作为一个整体 */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 第一个窗口：客户预算输入 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  客户预算
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                    请输入客户预算金额
                  </Label>
                  <Input id="budget" type="number" placeholder="请输入预算金额" value={budget} onChange={handleBudgetChange} className="text-lg font-semibold border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" min="0" step="0.01" />
                  <div className="text-sm text-gray-500">
                    支持小数点后两位
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 第二个窗口：利润率选择 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  利润率选择
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    请选择利润率
                  </Label>
                  <Select value={profitRate} onValueChange={setProfitRate}>
                    <SelectTrigger className="w-full border-2 border-green-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="选择利润率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="21">21%</SelectItem>
                      <SelectItem value="25">25%</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-gray-500">
                    当前选择：{profitRate}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 第三个窗口：计算结果 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  计算结果
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">客户预算：</span>
                      <span className="font-semibold text-gray-800">
                        {budget ? formatCurrency(parseFloat(budget)) : '¥0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">利润率：</span>
                      <span className="font-semibold text-gray-800">{profitRate}%</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">综合成本上限：</span>
                        <span className="text-xl font-bold text-purple-600">
                          {formatCurrency(cost)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {budget && profitRate && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        计算公式：{formatCurrency(parseFloat(budget))} × (1 - {profitRate}%) = {formatCurrency(cost)}
                      </p>
                    </div>}
                </div>
              </CardContent>
            </Card>

            {/* 第四个窗口：年支付成本总额 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  年支付成本总额
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">综合成本上限：</span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(cost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">计算系数：</span>
                      <span className="font-semibold text-gray-800">233 ÷ 1.2</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">年支付成本总额：</span>
                        <span className="text-xl font-bold text-orange-600">
                          {formatCurrency(annualCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 添加两个按钮 */}
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={handleNavigateToLaborContract} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium px-6 py-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              劳动合同
            </Button>
            <Button onClick={handleNavigateToDailyRate} className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium px-6 py-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              人天报价
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>提示：输入预算金额并选择利润率后，系统将自动计算综合成本上限和年支付成本总额</p>
        </div>
      </div>
    </div>;
}