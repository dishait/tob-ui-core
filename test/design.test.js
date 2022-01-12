import {
  Flex,
  Size,
  Emits,
  VModel,
  Color,
  Shadow,
  Rounded,
  InjectCounter,
  InjectEffects,
  ProvideEffects,
  ProvideCounter,
  bgColorPresets,
  textColorPresets,
} from '../core/index.js'

describe('颜色', () => {
  // 颜色范围
  const colors = [
    'primary', // 主要
    'secondary', // 次要
    'accent', // 强调
    'neutral', // 中和
    'base', // 基础
    'info', // 信息
    'success', // 成功
    'warning', // 警告
    'error', // 错误
  ]
  test('边界检查', () => {
    expect(() => Color({ presets: 1 })).toThrow(
      'design-color的preset配置必须是对象类型',
    )
  })

  describe('源校验', () => {
    test('props', () => {
      const color = Color()
      //   expect(color.props.color.default).toBe('')
      expect(color.props.light.default).toBe(false)
      expect(color.props.outline.default).toBe(false)
    })

    test('data', () => {
      const color = Color({ sourceType: 'data' })
      const data = color.data()

      expect(data.color).toBe('')
      expect(data.light).toBe(false)
      expect(data.outline).toBe(false)
    })

    test('默认值', () => {
      const color = Color({ color: 'base', light: true, outline: true })
      expect(color.props.color.default).toBe('base')
      expect(color.props.light.default).toBe(true)
      expect(color.props.outline.default).toBe(true)
    })
  })

  describe('设计', () => {
    test('原色', () => {
      const color = Color()
      for (const v of colors) {
        expect(color.computed.Color.call({ color: v })).toBe(
          `text-white bg-${v} bg-opacity-100`,
        )
      }
    })

    test('高亮', () => {
      const color = Color({ light: true })
      for (const v of colors) {
        expect(
          color.computed.Color.call({
            color: v,
            light: color.props.light.default,
          }),
        ).toBe(`text-${v} bg-${v} bg-opacity-10`)
      }
    })

    test('轮廓', () => {
      const color = Color({ outline: true })
      for (const v of colors) {
        expect(
          color.computed.Color.call({
            color: v,
            outline: color.props.outline.default,
          }),
        ).toBe(`text-${v} border border-${v} bg-transparent`)
      }
    })

    test('注入', () => {
      const color = Color({ inject: 'btn' })
      for (const v of colors) {
        expect(
          color.computed.Color.call({
            color: v,
          }),
        ).toBe(`btn-${v} text-white bg-${v} bg-opacity-100`)
      }
    })
  })

  describe('备用预设', () => {
    test('背景', () => {
      const color = Color({ presets: bgColorPresets })
      for (const v of colors) {
        expect(color.computed.Color.call({ color: v })).toBe(`bg-${v}`)
      }
    })

    test('文字', () => {
      const color = Color({ presets: textColorPresets })
      for (const v of colors) {
        expect(color.computed.Color.call({ color: v })).toBe(`text-${v}`)
      }
    })
  })
})

describe('圆角', () => {
  const presets = [
    'none', // 无
    'sm', // 小
    'base', // 基础
    'md', // 中
    'lg', // 大
    'xl', // 超大
    '2xl', // 超级大
    '3xl', // 无敌大
    'full', // 圆
  ]

  test('预设', () => {
    const rounded = Rounded()
    presets.forEach((v) => {
      if (v === 'base') {
        return expect(rounded.computed.Rounded.call({ rounded: 'base' })).toBe(
          'rounded',
        )
      }
      expect(rounded.computed.Rounded.call({ rounded: v })).toBe(`rounded-${v}`)
    })
  })

  describe('源校验', () => {
    test('props', () => {
      const rounded = Rounded()
      expect(rounded.props.rounded.default).toBe('none')
    })

    test('data', () => {
      const rounded = Rounded({ sourceType: 'data' })
      expect(rounded.data().rounded).toBe('none')
    })
  })

  test('自定义校验', () => {
    const rounded = Rounded({ sourceType: 'data', rounded: 'base' })
    expect(rounded.computed.Rounded.call(rounded.data())).toBe('rounded')

    const rounded2 = Rounded({ sourceType: 'data', rounded: 'foo' })
    expect(rounded.computed.Rounded.call(rounded2.data())).toBe('foo')
  })
})

describe('阴影', () => {
  const presets = [
    'none', // 无
    'sm', // 小
    'base', // 基础
    'md', // 中
    'lg', // 大
    'xl', // 超大
  ]

  test('预设', () => {
    const shadow = Shadow()
    presets.forEach((v) => {
      if (v === 'base') {
        return expect(shadow.computed.Shadow.call({ shadow: 'base' })).toBe(
          'shadow',
        )
      }
      expect(shadow.computed.Shadow.call({ shadow: v })).toBe(`shadow-${v}`)
    })
  })

  describe('源校验', () => {
    test('props', () => {
      const shadow = Shadow()
      expect(shadow.props.shadow.default).toBe('none')
    })

    test('data', () => {
      const shadow = Shadow({ sourceType: 'data' })
      expect(shadow.data().shadow).toBe('none')
    })
  })

  test('自定义校验', () => {
    const shadow = Shadow({ sourceType: 'data', shadow: 'base' })
    expect(shadow.computed.Shadow.call(shadow.data())).toBe('shadow')

    const shadow2 = Shadow({ sourceType: 'data', shadow: 'foo' })
    expect(shadow2.computed.Shadow.call(shadow2.data())).toBe('foo')
  })
})

describe('尺寸', () => {
  const presets = {
    xs: 'size-xs',
    sm: 'size-sm',
    md: 'size-md',
    lg: 'size-lg',
  }

  test('边界检查', () => {
    expect(() => Size({ presets: 1 })).toThrow(
      'design-size的preset配置必须是对象类型',
    )
  })

  test('预设', () => {
    const size = Size({ presets })
    for (const k in presets) {
      const v = presets[k]
      expect(size.computed.Size.call({ size: k })).toBe(v)
    }
  })

  describe('源校验', () => {
    test('props', () => {
      const size = Size({ presets })
      expect(size.props.size.default).toBe('md')
    })

    test('data', () => {
      const size = Size({ presets, sourceType: 'data' })
      expect(size.data().size).toBe('md')
    })
  })

  test('自定义校验', () => {
    const size = Size({ sourceType: 'data', presets, size: 'lg' })
    expect(size.computed.Size.call(size.data())).toBe('size-lg')

    const size2 = Size({ sourceType: 'data', size: 'foo' })
    expect(size2.computed.Size.call(size2.data())).toBe('foo')
  })
})

describe('vModel', () => {
  let o
  beforeEach(() => {
    o = VModel({ value: '' })
  })
  test('类型推断', () => {
    expect(o.props.value.default).toBe('')
    expect(o.props.value.type).toEqual(String)
  })

  test('获取', () => {
    expect(o.computed.VModelValue.call(o.props).default).toBe('')
  })

  test('更新', () => {
    o.props.$emit = function (type, v) {
      const isInput = type === 'input'
      if (isInput) {
        this.value = v
      }
    }
    o.methods.updateVModelValue.call(o.props, 'updated')
    expect(o.computed.VModelValue.call(o.props)).toBe('updated')
  })
})

describe('副作用集', () => {
  describe('提供effects依赖', () => {
    let o
    let v
    const fn = () => { }
    beforeEach(() => {
      o = ProvideEffects('foo')
      v = o.data()
      o.methods.trackEffect.call(v, 'custom', fn)
    })

    test('边界情况', () => {
      expect(ProvideEffects).toThrow(
        'effect的依赖配置必须包含name且类型为字符串',
      )
    })

    test('存在判断', () => {
      expect(o.methods.hasEffect.call(v, 'custom')).toBeTruthy()
    })

    test('获取', () => {
      expect(o.methods.showEffect.call(v, 'custom')()).toEqual(fn())
    })

    test('数量', () => {
      expect(o.methods.sizeEffects.call(v)).toBe(1)
    })

    test('收集与触发', () => {
      const bar = (v) => v
      o.methods.trackEffect.call(v, 'bar', bar)
      expect(o.methods.triggerEffect.call(v, 'bar', 100)).toBe(bar(100))

    })

    test('清除所有', () => {
      o.methods.clearEffects.call(v)
      expect(o.methods.showEffect.call(v, 'custom')).toBeFalsy()
    })

    test('销毁', () => {
      o.methods.destoryEffect.call(v, 'custom')
      expect(o.methods.showEffect.call(v, 'custom')).toBeFalsy()
    })
  })

  describe('注入effects依赖', () => {
    test('边界情况', () => {
      expect(InjectEffects).toThrow(
        'effect的注入配置必须包含name且类型为字符串',
      )
    })

    test('属性验证', () => {
      const o = InjectEffects('foo')
      for (const k in o.inject) {
        expect(k).toMatch(/^foo/g)
      }
    })
  })
})

describe('计数器', () => {
  describe('提供依赖', () => {
    let o
    let provider
    beforeEach(() => {
      o = ProvideCounter('foo')
      provider = o.provide.call(o.data())
    })

    test('边界情况', () => {
      expect(ProvideCounter).toThrow(
        'counter的依赖配置必须包含name且类型为字符串',
      )
    })

    test('使用', () => {
      const zero = provider.fooUseCounter()
      const one = provider.fooUseCounter()
      expect(zero).toBe(0)
      expect(one).toBe(1)
    })

    test('获取', () => {
      expect(provider.fooShowCounter()).toBe(0)
    })

    test('递增', () => {
      expect(provider.fooIncCounter()).toBe(1)
    })

    test('递减', () => {
      expect(provider.fooDecCounter()).toBe(-1)
    })
  })

  describe('注入依赖', () => {
    test('边界情况', () => {
      expect(InjectCounter).toThrow(
        'counter的注入配置必须包含name且类型为字符串',
      )
    })

    test('属性验证', () => {
      const o = InjectCounter('foo')
      for (const k in o.inject) {
        expect(k).toMatch(/^foo/g)
      }
    })
  })
})

describe('emits', () => {
  test('边界情况', () => {
    expect(() => Emits('foo')).toThrow('Emits参数必须是Array类型')
  })

  test('配置', () => {
    const emits = Emits(['click', 'open'])

    expect(emits.emits).toEqual(['click', 'open'])
  })

  test('测试', () => {
    const config = ['click']
    const emits = Emits(config)
    const o = {
      $emit: (_, v) => v,
    }
    expect(emits.methods.click.call(o, 100)).toBe(100)
  })
})

describe('flex', () => {
  test('props校验', () => {
    const o = Flex({
      justify: 'center',
      align: 'center',
      direction: 'col',
    })

    expect(o.props.justify.default).toBe('center')
    expect(o.props.align.default).toBe('center')
    expect(o.props.direction.default).toBe('col')
  })

  test('computed校验', () => {
    const o = Flex()
    const justifyPresets = {
      end: 'justify-end', // 尾部
      start: 'justify-start', // 头部
      center: 'justify-center', // 中间
      around: 'justify-around', // 等比
      evenly: 'justify-evenly', // 等距
      between: 'justify-between', // 靠两头
    }

    const alignPresets = {
      end: 'items-flex-end', // 尾部
      center: 'items-center', // 中间
      stretch: 'items-stretch', // 填充
      start: 'items-flex-start', // 头部
      baseline: 'items-baseline', // 基线对齐
    }

    // 方向预设
    const directionPresets = {
      row: 'flex-row',
      col: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'col-reverse': 'flex-col-reverse',
    }

    for (const k in justifyPresets) {
      const v = justifyPresets[k]
      expect(
        o.computed.Justify.call({
          justify: k,
        }),
      ).toBe(v)
    }

    for (const k in alignPresets) {
      const v = alignPresets[k]
      expect(
        o.computed.Align.call({
          align: k,
        }),
      ).toBe(v)
    }

    for (const k in directionPresets) {
      const v = directionPresets[k]
      expect(
        o.computed.Direction.call({
          direction: k,
        }),
      ).toBe(v)
    }
  })
})
