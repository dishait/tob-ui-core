import { $C, $M, $P } from '../core/index.js'

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
