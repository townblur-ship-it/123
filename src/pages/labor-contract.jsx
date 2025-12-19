// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, FileText, Wallet, PiggyBank, Calculator, TrendingUp, Calendar, DollarSign } from 'lucide-react';

export default function LaborContract(props) {
  const {
    $w,
    style
  } = props;

  // 从URL参数获取传递的数据
  const [initialData, setInitialData] = useState({
    budget: '',
    profitRate: '15',
    cost: 0,
    annualCost: 0,
    baseSalary: '7460',
    otherCostBonus: '0',
    socialSecurityCost: 0,
    cash: 0,
    preTaxSalary: 0
  });

  // 当前计算状态
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

  // 页面加载时获取URL参数
  useEffect(() => {
    const params = $w.page.dataset.params;
    if (params && Object.keys(params).length > 0) {
      setInitialData({
        budget: params.budget || '',
        profitRate: params.profitRate || '15',
        cost: parseFloat(params.cost) || 0,
        annualCost: parseFloat(params.annualCost) || 0,
        baseSalary: params.baseSalary || '7460',
        otherCostBonus: params.otherCostBonus || '0',
        socialSecurityCost: parseFloat(params.socialSecurityCost) || 0,
        cash: parseFloat(params.cash) || 0,
        preTaxSalary: parseFloat(params.preTaxSalary) || 0
      });

      // 设置当前状态
      setBaseSalary(params.baseSalary || '7460');
      setOtherCostBonus(params.otherCostBonus || '0');
    }
  }, [$w.page.dataset.params]);

  // 计算含社保成本：基础工资 × 1.4
  useEffect(() => {
    if (baseSalary && !isNaN(baseSalary)) {
      const calculatedSocialSecurityCost = parseFloat(baseSalary) * 1.4;
      setSocialSecurityCost(calculatedSocialSecurityCost);
    } else {
      setSocialSecurityCost(0);
    }
  }, [baseSalary]);

  // 计算现金：(年支付成本 - 其他成本奖金 - 2000) ÷ 12 - 含社保成本
  useEffect(() => {
    const annualCost = initialData.annualCost;
    if (annualCost > 0 && !isNaN(otherCostBonus)) {
      const otherCostBonusValue = parseFloat(otherCostBonus) || 0;
      const calculatedCash = (annualCost - otherCostBonusValue - 2000) / 12 - socialSecurityCost;
      setCash(calculatedCash);
    } else {
      setCash(0);
    }
  }, [initialData.annualCost, otherCostBonus, socialSecurityCost]);

  // 计算税前工资：现金 + 基本工资
  useEffect(() => {
    if (baseSalary && !isNaN(baseSalary)) {
      const baseSalaryValue = parseFloat(baseSalary);
      const calculatedPreTaxSalary = cash + baseSalaryValue;
      setPreTaxSalary(calculatedPreTaxSalary);
    } else {
      setPreTaxSalary(0);
    }
  }, [cash, baseSalary]);
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
  const handleNavigateBack = () => {
    // 传递预算金额和利润率回到计算器页面
    $w.utils.navigateTo({
      pageId: 'calculator',
      params: {
        budget: initialData.budget,
        profitRate: initialData.profitRate
      }
    });
  };
  return <div style={style} className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center gap-4">
            <Button onClick={handleNavigateBack} className="bg-white text-teal-600 hover:bg-teal-50 border border-teal-200 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回计算器
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">劳动合同计算</h1>
              <p className="text-gray-600 mt-2">基于年支付成本总额计算工资构成</p>
            </div>
          </div>
        </div>

        {/* 数据概览区 */}
        <div className="mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                基础数据概览
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">客户预算</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {initialData.budget ? formatCurrency(parseFloat(initialData.budget)) : '¥0.00'}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">利润率</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {initialData.profitRate}%
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">综合成本上限</span>
                  </div>
                  <div className="text-xl font-bold text-purple-600">
                    {formatCurrency(initialData.cost)}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">年支付成本总额</span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">
                    {formatCurrency(initialData.annualCost)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要计算区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 劳动合同配置 */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                劳动合同配置
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    基础工资
                  </Label>
                  <Select value={baseSalary} onValueChange={setBaseSalary}>
                    <SelectTrigger className="w-full border-2 border-teal-200 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="选择基础工资" />
                    </SelectTrigger>
                    <SelectContent>
                      {salaryOptions.map(option => <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-teal-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">基础工资：</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(parseFloat(baseSalary) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">含社保成本：</span>
                    <span className="font-semibold text-teal-600">
                      {formatCurrency(socialSecurityCost)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    计算公式：基础工资 × 1.4
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherCostBonus" className="text-sm font-medium text-gray-700">
                    其他成本奖金
                  </Label>
                  <Input id="otherCostBonus" type="number" placeholder="请输入其他成本奖金" value={otherCostBonus} onChange={handleOtherCostBonusChange} className="border-2 border-teal-200 focus:border-teal-500 focus:ring-teal-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" min="0" step="0.01" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 现金计算 */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                现金计算
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-cyan-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">年支付成本总额：</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(initialData.annualCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">其他成本奖金：</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(parseFloat(otherCostBonus) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">固定扣除：</span>
                    <span className="font-semibold text-gray-800">¥2,000.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">含社保成本：</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(socialSecurityCost)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">现金：</span>
                      <span className="text-xl font-bold text-cyan-600">
                        {formatCurrency(cash)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                  <p className="text-xs text-cyan-800">
                    计算公式：({formatCurrency(initialData.annualCost)} - {formatCurrency(parseFloat(otherCostBonus) || 0)} - 2,000) ÷ 12 - {formatCurrency(socialSecurityCost)} = {formatCurrency(cash)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 税前工资计算 */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                税前工资计算
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">现金：</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(cash)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">基本工资：</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(parseFloat(baseSalary) || 0)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">税前工资：</span>
                      <span className="text-xl font-bold text-amber-600">
                        {formatCurrency(preTaxSalary)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800">
                    计算公式：{formatCurrency(cash)} + {formatCurrency(parseFloat(baseSalary) || 0)} = {formatCurrency(preTaxSalary)}
                  </p>
                </div>

                <div className="mt-4 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border border-amber-200">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">最终税前工资</div>
                    <div className="text-2xl font-bold text-amber-700">
                      {formatCurrency(preTaxSalary)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      月薪标准
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>提示：您可以调整基础工资和其他成本奖金，系统将实时重新计算现金和税前工资</p>
        </div>
      </div>
    </div>;
}