import { $C, $M, $P, $DA, $DE, $H } from '../core/index.js'

describe('data生成器', () => {
	describe('边界检查', () => {
		test('非法类型', () => {
			expect(() => $DA('')).toThrow(
				'data 生成器只支持接收函数类型与对象类型'
			)
		})
	})

	test('原生函数', () => {
		const foo = () => ({ bar: 100 })
		expect($DA(foo)().bar).toBe(100)
	})

	test('对象模式', () => {
		const foo = { bar: 100 }
		expect($DA(foo)().bar).toBe(100)
	})
})

describe('props生成器', () => {
	describe('边界检查', () => {
		test('非法类型', () => {
			expect(() =>
				$P({
					foo: undefined
				})
			).toThrow(`props生成器暂不支持键foo的类型Undefined`)
		})
	})
	test('通用基础类型', () => {
		const props = $P({
			foo: 0,
			bar: '',
			test: false
		})

		expect(props).toEqual({
			foo: {
				type: Number,
				default: 0
			},
			bar: {
				type: String,
				default: ''
			},
			test: {
				type: Boolean,
				default: false
			}
		})
	})

	test('引用类型', () => {
		const props = $P({
			foo: {},
			bar: [],
			test: () => {}
		})

		expect(props.foo.default()).toEqual({})
		expect(props.bar.default()).toEqual([])
		expect(props.test.default()()).toBeUndefined()
	})

	test('自定义', () => {
		const props = $P({
			foo: {
				kk: 1
			},
			bar: [1, 2],
			test: 'base'
		})

		expect(props.foo.default()).toEqual({ kk: 1 })

		expect(props.bar.default()).toEqual([1, 2])
		expect(props.test.default).toBe('base')
	})
})

describe('computed生成器', () => {
	describe('边界检查', () => {
		test('非法模式', () => {
			expect(() =>
				$C({
					foo: 1
				})
			).toThrow(
				'computed生成器暂不支持键foo的配置类型Number'
			)
		})
	})

	describe('原生模式', () => {
		test('only getter(函数形式)', () => {
			const computed = $C({
				foo() {
					return this.bar
				}
			})

			expect(computed.foo.call({ bar: 1 })).toBe(1)
		})

		test('getter and setter(对象形式)', () => {
			const computed = $C({
				foo: {
					get() {
						return this.bar
					},
					set() {
						return ++this.bar
					}
				}
			})

			expect(computed.foo.get.call({ bar: 1 })).toBe(1)
			expect(computed.foo.set.call({ bar: 1 })).toBe(2)
		})
	})

	describe('字符串模式', () => {
		const computed = $C({
			Foo: 'bar'
		})

		test('空校验', () => {
			expect(computed.Foo.call({ foo: '' })).toBeNull()
		})

		test('Truthy时预取', () => {
			expect(computed.Foo.call({ foo: 'test' })).toBe('bar')
		})

		test('变量替换', () => {
			const computed = $C({
				Foo: 'bar-$'
			})
			expect(computed.Foo.call({ foo: 'test' })).toBe(
				'bar-test'
			)
		})
	})

	describe('数组模式', () => {
		describe('边界检查', () => {
			test('长度不能小于2', () => {
				expect(() =>
					$C({
						Foo: []
					})
				).toThrow(
					'computed生成器暂不支键Foo的数组配置，数组配置长度只允许为2或3'
				)

				expect(() =>
					$C({
						Foo: [1]
					})
				).toThrow(
					'computed生成器暂不支键Foo的数组配置，数组配置长度只允许为2或3'
				)

				expect(() =>
					$C({
						Foo: [1, 2, 3, 4]
					})
				).toThrow(
					'computed生成器暂不支键Foo的数组配置，数组配置长度只允许为2或3'
				)
			})
		})

		describe('对立判断', () => {
			test('Truthy', () => {
				const computed = $C({
					Foo: ['Truthy', 'Falsy']
				})
				expect(computed.Foo.call({ foo: true })).toBe(
					'Truthy'
				)
			})

			test('Falsy', () => {
				const computed = $C({
					Foo: ['Truthy', 'Falsy']
				})
				expect(computed.Foo.call({})).toBe('Falsy')
			})

			test('变量替换', () => {
				const computed = $C({
					Foo: ['Truthy-$', 'Falsy']
				})
				expect(computed.Foo.call({ foo: false })).toBe(
					'Falsy'
				)
				expect(computed.Foo.call({ foo: true })).toBe(
					'Truthy-true'
				)
				expect(computed.Foo.call({ foo: 'bar' })).toBe(
					'Truthy-bar'
				)
			})
		})

		describe('三元判断', () => {
			test('Truthy', () => {
				const computed = $C({
					Foo: ['bar', 'Truthy', 'Falsy']
				})
				expect(computed.Foo.call({ foo: 'bar' })).toBe(
					'Truthy'
				)
			})

			test('Falsy', () => {
				const computed = $C({
					Foo: ['bar', 'Truthy', 'Falsy']
				})
				expect(computed.Foo.call({ foo: 'test' })).toBe(
					'Falsy'
				)
			})

			test('变量替换', () => {
				const computed = $C({
					Foo: ['bar', 'Truthy-$', 'Falsy-$']
				})

				expect(computed.Foo.call({ foo: 'bar' })).toBe(
					'Truthy-bar'
				)
				expect(computed.Foo.call({ foo: 'foo' })).toBe(
					'Falsy-foo'
				)
			})
		})
	})

	describe('对象模式', () => {
		test('预设', () => {
			const computed = $C({
				Foo: {
					bar: 1,
					test: 2
				}
			})

			expect(computed.Foo.call({ foo: 'bar' })).toBe(1)
			expect(computed.Foo.call({ foo: 'test' })).toBe(2)
		})

		test('变量替换', () => {
			const computed = $C({
				Foo: {
					bar: 'foo-$'
				}
			})

			expect(computed.Foo.call({ foo: 'bar' })).toBe(
				'foo-bar'
			)
		})

		test('自定义', () => {
			const computed = $C({
				Foo: {
					bar: 'foo-$'
				}
			})

			expect(computed.Foo.call({ foo: 'test' })).toBe(
				'test'
			)
		})
	})
})

describe('methods', () => {
	describe('函数注入', () => {
		let vm
		beforeEach(() => {
			vm = {
				status: false
			}
		})
		test('toggle模式', () => {
			const o = Object.assign(
				vm,
				$M({
					toggle: true
				})
			)

			o.toggle('status')
			expect(o.status).toBe(true)

			o.toggle('status')
			expect(o.status).toBe(false)

			o.toggle('status', false)
			expect(o.status).toBe(false)
		})
	})
})

describe('designs', () => {
	test('边界检查', () => {
		expect(() =>
			$DE({
				foo: { bar: 100 }
			})
		).toThrow('该design - foo 不存在')
	})

	describe('内置design开启', () => {
		test('颜色', () => {
			expect($DE({ color: true })[0].props).toEqual({
				color: {
					type: String,
					default: ''
				},
				light: {
					type: Boolean,
					default: false
				},
				outline: {
					type: Boolean,
					default: false
				}
			})
		})

		test('阴影', () => {
			expect($DE({ shadow: true })[0].props).toEqual({
				shadow: {
					type: String,
					default: 'none'
				}
			})
		})

		test('圆角', () => {
			expect($DE({ rounded: true })[0].props).toEqual({
				rounded: {
					type: String,
					default: 'none'
				}
			})
		})

		test('flex', () => {
			expect($DE({ flex: true })[0].props).toEqual({
				justify: {
					type: String,
					default: 'start'
				},
				align: {
					type: String,
					default: 'stretch'
				},
				direction: {
					type: String,
					default: 'row'
				}
			})
		})

		test('size', () => {
			expect($DE({ size: true })[0].props).toEqual({
				size: {
					type: String,
					default: 'md'
				}
			})
		})

		test('vModel', () => {
			expect($DE({ vModel: true })[0].props).toEqual({
				value: {
					type: Boolean,
					default: true
				},
				modelValue: {
					type: Boolean,
					default: true
				}
			})
		})

		test('emits', () => {
			expect(
				$DE({
					emits: ['click', 'close']
				})[0].emits
			).toEqual(['click', 'close'])
		})

		test('effects', () => {
			expect(
				$DE({ provideEffects: 'foo' })[0].provide.call({
					hasEffect: 1
				}).fooHasEffect
			).toBe(1)
			expect(
				$DE({
					injectEffects: 'foo'
				})[0].inject.fooHasEffect.default()
			).toBeUndefined()
		})

		test('counter', () => {
			expect(
				$DE({ provideCounter: 'foo' })[0]
					.provide.call({
						counter: 0
					})
					.fooUseCounter()
			).toEqual(0)
			expect(
				$DE({
					injectCounter: 'foo'
				})[0].inject.fooUseCounter.default()
			).toBeUndefined()
		})
	})

	test('简化开启', () => {
		const open = ['rounded', 'shadow', 'color']
		expect($DE({ open })[0].props).toEqual({
			rounded: {
				type: String,
				default: 'none'
			}
		})

		expect($DE({ open })[1].props).toEqual({
			shadow: {
				type: String,
				default: 'none'
			}
		})

		expect($DE({ open })[2].props).toEqual({
			color: {
				type: String,
				default: ''
			},
			light: {
				type: Boolean,
				default: false
			},
			outline: {
				type: Boolean,
				default: false
			}
		})
	})

	describe('格式化默认配置', () => {
		expect(
			$DE({ size: { default: 'lg' } })[0].props
		).toEqual({ size: { type: String, default: 'lg' } })
	})

	test('默认嵌套配置', () => {
		expect(
			$DE({ color: { light: true } })[0].props
		).toEqual({
			color: {
				type: String,
				default: ''
			},
			light: {
				type: Boolean,
				default: true
			},
			outline: {
				type: Boolean,
				default: false
			}
		})
	})

	test('复杂预设配置', () => {
		const config = {
			size: {
				default: 'lg',
				presets: {
					lg: 'text-lg'
				}
			}
		}
		expect(
			$DE(config)[0].computed.Size.call({ size: 'lg' })
		).toBe('text-lg')
	})
})

describe('hack', () => {
	test('data', () => {
		const options = {
			data: {
				foo: 100
			}
		}

		const { data: createData } = $H(options)
		expect(createData()).toEqual({
			foo: 100
		})
	})

	test('props', () => {
		const options = {
			props: { name: 'zhangsan', age: 18 }
		}

		expect($H(options)).toEqual({
			props: {
				name: {
					type: String,
					default: 'zhangsan'
				},
				age: {
					type: Number,
					default: 18
				}
			}
		})
	})

	test('computed', () => {
		const options = {
			computed: {
				Name: 'I am $'
			}
		}

		expect(
			$H(options).computed.Name.call({ name: 'zhangsan' })
		).toBe('I am zhangsan')
	})

	test('methods', () => {
		const options = {
			methods: {
				toggle: true
			}
		}
		const { methods } = $H(options)
		const payload = { visible: false }
		methods.toggle.call(payload, 'visible')
		expect(payload.visible).toBe(true)

		methods.toggle.call(payload, 'visible', false)
		expect(payload.visible).toBe(false)
	})

	describe('designs', () => {
		test('单一', () => {
			const options = {
				designs: {
					shadow: true
				}
			}
			expect($H(options).mixins[0].props).toEqual({
				shadow: {
					type: String,
					default: 'none'
				}
			})
		})

		test('混合原生mixins', () => {
			const options = {
				designs: {
					rounded: true
				},
				mixins: [
					{
						foo: 100
					}
				]
			}
			const { mixins } = $H(options)
			const [rounded, origin] = mixins
			expect(rounded.props).toEqual({
				rounded: {
					type: String,
					default: 'none'
				}
			})

			expect(origin).toEqual({
				foo: 100
			})
		})
	})
})
