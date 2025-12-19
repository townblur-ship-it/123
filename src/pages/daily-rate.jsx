// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, Calculator, TrendingUp, Calendar, DollarSign, Settings } from 'lucide-react';

export default function DailyRate(props) {
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
  const [socialSecurityAdjustmentRate, setSocialSecurityAdjustmentRate] = useState('0'); // 社保调整比例
  const [compensationAdjustmentRate, setCompensationAdjustmentRate] = useState('0'); // 补偿金调整比例
  const [socialSecurityCost, setSocialSecurityCost] = useState(0);
  const [adjustedAnnualCost, setAdjustedAnnualCost] = useState(0); // 调整后的年支付成本总额
  const [finalDailyRate, setFinalDailyRate] = useState(0); // 最终人天报价

  // 计算过程详情
  const [calculationDetails, setCalculationDetails] = useState({
    socialSecurityAdjustmentAmount: 0,
    afterSocialSecurityAdjustment: 0,
    compensationAdjustmentAmount: 0
  });

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

  // 计算调整后的年支付成本总额（使用新的社保调整公式）
  useEffect(() => {
    const annualCost = initialData.annualCost;
    if (annualCost > 0) {
      const socialSecurityAdjustment = parseFloat(socialSecurityAdjustmentRate) || 0;
      const compensationAdjustment = parseFloat(compensationAdjustmentRate) || 0;

      // 社保调整计算公式：年支付成本 - (含社保成本 - 基础工资) × 12 × (1 - 社保调整比例)
      const socialSecurityAdjustmentAmount = (socialSecurityCost - parseFloat(baseSalary || 0)) * 12 * (1 - socialSecurityAdjustment / 100);

      // 经过社保调整部分后的年支付成本
      const afterSocialSecurityAdjustment = annualCost - socialSecurityAdjustmentAmount;

      // 补偿金调整计算方式：原支付年成本 × 0.2 × 输入的补偿金调整比例 + 经过社保调整部分后的年支付成本
      const compensationAdjustmentAmount = annualCost * 0.2 * (compensationAdjustment / 100);

      // 调整后的年支付成本总额 = 经过社保调整部分后的年支付成本 + 补偿金调整金额
      const adjustedCost = afterSocialSecurityAdjustment + compensationAdjustmentAmount;
      setAdjustedAnnualCost(adjustedCost);

      // 保存计算过程详情
      setCalculationDetails({
        socialSecurityAdjustmentAmount,
        afterSocialSecurityAdjustment,
        compensationAdjustmentAmount
      });
    } else {
      setAdjustedAnnualCost(0);
      setCalculationDetails({
        socialSecurityAdjustmentAmount: 0,
        afterSocialSecurityAdjustment: 0,
        compensationAdjustmentAmount: 0
      });
    }
  }, [initialData.annualCost, socialSecurityAdjustmentRate, compensationAdjustmentRate, socialSecurityCost, baseSalary]);

  // 计算最终人天报价：调整后的年支付成本 ÷ 233
  useEffect(() => {
    if (adjustedAnnualCost > 0) {
      const calculatedFinalDailyRate = adjustedAnnualCost / 233;
      setFinalDailyRate(calculatedFinalDailyRate);
    } else {
      setFinalDailyRate(0);
    }
  }, [adjustedAnnualCost]);
  const handleSocialSecurityAdjustmentChange = e => {
    const value = e.target.value;
    if (value === '' || !isNaN(value) && parseFloat(value) >= 0) {
      setSocialSecurityAdjustmentRate(value);
    }
  };
  const handleCompensationAdjustmentChange = e => {
    const value = e.target.value;
    if (value === '' || !isNaN(value) && parseFloat(value) >= 0) {
      setCompensationAdjustmentRate(value);
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
  return <div style={style} className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center gap-4">
            <Button onClick={handleNavigateBack} className="bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回计算器
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">人天报价计算</h1>
              <p className="text-gray-600 mt-2">基于年支付成本总额计算人天报价</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 调整比例配置 */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                调整比例配置
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="socialSecurityAdjustment" className="text-sm font-medium text-gray-700">
                    社保调整比例 (%)
                  </Label>
                  <Input id="socialSecurityAdjustment" type="number" placeholder="请输入社保调整比例" value={socialSecurityAdjustmentRate} onChange={handleSocialSecurityAdjustmentChange} className="border-2 border-teal-200 focus:border-teal-500 focus:ring-teal-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" min="0" step="0.01" />
                  <div className="text-xs text-gray-500">
                    用于调整社保相关成本
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compensationAdjustment" className="text-sm font-medium text-gray-700">
                    补偿金调整比例 (%)
                  </Label>
                  <Input id="compensationAdjustment" type="number" placeholder="请输入补偿金调整比例" value={compensationAdjustmentRate} onChange={handleCompensationAdjustmentChange} className="border-2 border-teal-200 focus:border-teal-500 focus:ring-teal-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" min="0" step="0.01" />
                  <div className="text-xs text-gray-500">
                    用于调整补偿金相关成本
                  </div>
                </div>

                <div className="bg-teal-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">原年支付成本：</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(initialData.annualCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">调整后年支付成本：</span>
                    <span className="font-semibold text-teal-600">
                      {formatCurrency(adjustedAnnualCost)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    社保调整：年支付成本 - (含社保成本 - 基础工资) × 12 × (1 - 社保调整%)
                  </div>
                  <div className="text-xs text-gray-500">
                    补偿金调整：原支付年成本 × 0.2 × 补偿金调整% + 社保调整后成本
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 最终人天报价结果 */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-rose-500 to-rose-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                最终人天报价
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-rose-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">调整后年支付成本：</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(adjustedAnnualCost)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">最终人天报价：</span>
                      <span className="text-3xl font-bold text-rose-600">
                        {formatCurrency(finalDailyRate)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                  <p className="text-xs text-rose-800">
                    计算公式：{formatCurrency(adjustedAnnualCost)} ÷ 233 = {formatCurrency(finalDailyRate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>提示：您可以调整社保调整比例和补偿金调整比例，系统将实时重新计算最终人天报价</p>
        </div>
      </div>
    </div>;
}