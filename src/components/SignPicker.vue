<template>
    <div class="e-calendar">
      <div class="e-calendar-container" v-show="!showYear">
         <!--<div class="e-calendar-toolbar">
          <div class="e-calendar-svg" @click="prevMonth">
            <svg viewBox="0 0 24 24" class="e-calendar-svg-icon"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
            <transition name="e_calendar_svg_btn">
              <div class="e-calendar-svg-cover" v-if="prevMonthClick"></div>
            </transition>
          </div> -->
          <!-- <div class="e-calendar-toolbar-title">
            <transition :name="fadeXType">
              <div :key="showDate.monthStr" class="e-calendar-toolbar-title-content"><strong>{{showDate.year}}</strong> <span>{{ showDate.monthStr }}</span></div>
            </transition>
          </div> -->
          <!-- <div class="e-calendar-svg" @click="nextMonth">
            <svg viewBox="0 0 24 24" class="e-calendar-svg-icon"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
            <transition name="e_calendar_svg_btn">
              <div class="e-calendar-svg-cover" v-if="nextMonthClick"></div>
            </transition>
          </div>
        </div> -->
        <!-- <div class="e-calendar-week">
          <span class="e-calendar-week-day">日</span>
          <span class="e-calendar-week-day">一</span>
          <span class="e-calendar-week-day">二</span>
          <span class="e-calendar-week-day">三</span>
          <span class="e-calendar-week-day">四</span>
          <span class="e-calendar-week-day">五</span>
          <span class="e-calendar-week-day">六</span>
        </div> -->
        <div class="e-calendar-monthday">
          <transition :name="fadeXType">
            <div :key="showDate.monthStr" class="e-calendar-monthday-wrapper">
              <div class="e-calendar-monthday-row" v-for="(row,index) in rows" :key='index'>
              <span v-for="(day,index) in row" :key='index' class="e-calendar-monthday-row-day" @click="selectDay(day)" :class="{'active': day.hasSign, 'disabled': day.disabled, 'pointer': day.value !== ''}">
                <span v-text="day.value" class="e-calendar-monthday-row-day-value"></span>
                 <transition name="e_calendar_day">
                   <span class="e-calendar-monthday-row-day-cover" v-if="day.hasSign"></span>
                 </transition>
              </span>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <!-- <ul class="e-calendar-year" v-show="showYear" ref="yearList">
        <li v-for="(item,index) in yearList" :key='index' :class="{'active': item === selectDate.year}" @click="selectYear(item)"></li>
      </ul> -->
      <!-- <div class="e-calendar-actions">
        <button class="btn" @click="cancel">取消</button>
        <button class="btn" @click="confirm">确定</button>
      </div> -->
    </div>
</template>
<script>
// import {
//   getSignDays
// } from '@/api/index'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import {
  Toast
} from 'mint-ui'
// 阿拉伯数字 转 汉字数字的基本库

const weekJson = {
  1: '星期日',
  2: '星期一',
  3: '星期二',
  4: '星期三',
  5: '星期四',
  6: '星期五',
  7: '星期六'
}
const monthJson = {
  1: '一月',
  2: '二月',
  3: '三月',
  4: '四月',
  5: '五月',
  6: '六月',
  7: '七月',
  8: '八月',
  9: '九月',
  10: '十月',
  11: '十一月',
  12: '十二月'
}
export default {
  name: 'DatePicker',
  components: {
    Toast
  },
  props: {
    // 打开date picker的初始值，必传，格式是（2017-08-11）
    date: {
      type: String,
      required: true
    },
    // 日期最小值
    minDate: {
      type: String,
      default: '1970-01-01'
    },
    // 日期最大值
    maxDate: {
      type: String,
      default: '2020-12-31'
    },
    signList: {
      type: Array
    }
  },
  computed: {
    ...mapGetters([]),
    yearList() {
      const result = []
      for (let i = this.copyMinDate.year; i <= this.copyMaxDate.year; i += 1) {
        result.push(i)
      }
      return result
    },
    title() {
      // calendar 上面的所有 title 信息包括二部分
      return {
        year: '',
        monthday: ''
      }
    },
    rows() {
      const { year, month } = this.showDate
      const months = (new Date(year, month - 1, 0)).getDate()
      const result = []
      let row = []
      let weekValue
      // 按照星期分组
      for (let i = 1; i <= months; i += 1) {
        // 根据日期获取星期，并让开头是1，而非0
        weekValue = (new Date(year, month - 1, i)).getDay() + 1
        // 判断月第一天在星期几，并填充前面的空白区域
        if (i === 1 && weekValue !== 1) {
          this.addRowEmptyValue(row, weekValue)
          console.log(this.signDays)
          this.addRowDayValue(row, i, this.signDays.includes(i))
        } else {
          this.addRowDayValue(row, i, this.signDays.includes(i))
          // 判断月最后一天在星期几，并填充后面的空白区域
          if (i === months && weekValue !== 7) {
            this.addRowEmptyValue(row, (7 - weekValue) + 1)
          }
        }
        // 按照一周分组
        if (weekValue % 7 === 0 || i === months) {
          result.push(row)
          row = []
        }
      }
      this.showDate.monthStr = monthJson[this.showDate.month]
      return result
    }

  },
  data() {
    return {
      selectDate: {
        year: '',
        month: '',
        day: '',
        week: '',
        date: '',
        weekStr: '',
        monthStr: ''
      }, // 选择的时间，默认是用户传的date时间
      showDate: {
        year: '',
        month: '',
        day: '',
        week: '',
        date: '',
        monthStr: '',
        weekStr: ''
      },
      copyMinDate: {
        year: '',
        month: '',
        day: ''
      },
      copyMaxDate: {
        year: '',
        month: '',
        day: ''
      },
      signDays: [],
      toolbar: '',
      fadeXType: 'fadeX_Prev',
      nextMonthClick: false,
      prevMonthClick: false,
      showYear: false
    }
  },
  created() {
    // this.getList()
    this.signDays = this.signList
    this.initDatePicker()
    console.log(this.signList)
  },
  methods: {
    ...mapMutations({
      setSignData: 'SET_SIGNDATA'
    }),
    initDatePicker() {
      this.showDate = { ...this.splitDate(this.date, true) }
      this.copyMinDate = { ...this.splitDate(this.minDate) }
      this.copyMaxDate = { ...this.splitDate(this.maxDate) }
      this.selectDate = { ...this.showDate }
    },
    splitDate(date, addStr) {
      let result = {}
      const splitValue = date.split('-')
      try {
        if (!splitValue || splitValue.length < 3) {
          throw new Error('时间格式不正确')
        }
        result = {
          year: Number(splitValue[0]),
          month: Number(splitValue[1]),
          day: Number(splitValue[2])
        }
        if (addStr) {
          result.week = (new Date(result.year, result.month - 1, result.day)).getDay() + 1
          result.monthStr = monthJson[result.month]
          result.weekStr = weekJson[result.week]
        }
      } catch (error) {
        console.error(error)
      }
      return result
    },
    addRowEmptyValue(row, count) {
      for (let w = 1; w < count; w += 1) {
        row.push({
          value: ''
        })
      }
    },
    addRowDayValue(row, i, isSign) {
      const value = { value: i, hasSign: false }
      // const { day, month, year } = this.selectDate
      // const showDate = this.showDate
      // // 判断已经选择的
      // if (year === showDate.year && month === showDate.month && day === i) {
      //   value.selected = true
      // }
      // // 当日期在最小值之外，禁止点击
      // if (this.isMinLimitMonth() && i < this.copyMinDate.day) {
      //   value.disabled = true
      // }
      // // 当日期在最大值之外，禁止点击
      // if (this.isMaxLimitMonth() && i > this.copyMinDate.day) {
      //   value.disabled = true
      // }
      value.hasSign = isSign
      row.push(value)
    },
    resetSelectDate(dayValue) {
      this.selectDate = { ...this.showDate }
      this.selectDate.day = dayValue
      this.selectDate.week = (new Date(this.showDate.year, this.showDate.month - 1, dayValue)).getDay() + 1
      this.selectDate.weekStr = weekJson[this.selectDate.week]
    },
    selectDay(day) {
      if (day.disabled || day.selected || day.value === '') {
        return
      }
      this.resetSelectDate(day.value)
      if (day.hasfoot) {
        var time = this.showDate.year + '-' + this.keepDoubleDigit(this.showDate.month) + '-' + this.showDate.day
        const splitValue = time.split('-')
        splitValue[2] = this.keepDoubleDigit(day.value)
        let data = splitValue.join('-')
        this.$emit('getValue', data)
      } else {
        this.$emit('getValue', false)
        // Toast({
        //   message: '当天没有足迹',
        //   duration: 1000
        // })
      }
      // var that=this
      // this.confirm()
    },
    selectYear(value) {
      this.showYear = false
      this.showDate.year = value
      let type
      // 当日期在最小值之外，月份换成最小值月份 或者 当日期在最大值之外，月份换成最大值月份
      if (this.isMinLimitMonth()) {
        type = 'copyMinDate'
      } else if (this.isMaxLimitMonth()) { // 当日期在最大值之外，月份换成最大值月份
        type = 'copyMaxDate'
      }
      if (type) {
        this.showDate.month = this[type].month
        this.showDate.day = this[type].day
        this.resetSelectDate(this.showDate.day)
        return
      }
      let dayValue = this.selectDate.day
      // 判断日是最大值，防止另一个月没有这个日期
      if (this.selectDate.day > 28) {
        const months = (new Date(this.showDate.year, this.showDate.month - 1, 0)).getDate()
        // 当前月份没有这么多天，就把当前月份最大值赋值给day
        dayValue = months < dayValue ? months : dayValue
      }
      this.resetSelectDate(dayValue)
    },
    isMinLimitMonth() {
      return this.showDate.year <= this.copyMinDate.year && this.showDate.month <= this.copyMinDate.month
    },
    isMaxLimitMonth() {
      return this.showDate.year >= this.copyMaxDate.year && this.showDate.month >= this.copyMaxDate.month
    },
    openYearList() {
      if (this.showYear) {
        this.showYear = false
        return
      }
      const index = this.yearList.indexOf(this.selectDate.year)
      this.showYear = true
      setTimeout(() => {
        this.$refs.yearList.scrollTop = (index - 3) * 40
      })
    },
    openCalendarList() {
      this.showYear = false
    },
    // 保持两位数
    keepDoubleDigit(number) {
      return number > 9 ? number : `0${number}`
    },
    confirm() {
      const { year, month, day, week, weekStr, monthStr } = this.selectDate
      this.$emit('confirm', {
        date: `${year}-${this.keepDoubleDigit(month)}-${this.keepDoubleDigit(day)}`,
        year,
        month,
        week,
        monthStr,
        weekStr,
        day
      })
    }
    // cancel() {
    //   this.$emit('cancel')
    // }
  }
}
</script>

<style scoped lang="less">
  // @import "../../../static/styles/basic";
  // @import "../../../static/styles/borderBox";
  .e-{
    &calendar-wrapper{
      position: fixed;
      left:0;
      top:0;
      bottom:0;
      right:0;
      background-color: rgba(0, 0, 0, .5);
      z-index: 99999;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
    }
    &calendar{
      // background-color: #ffffff;
      width: 100%;
    }
    &date-select{
      background-color: #00bcd4;
      padding: 12/50rem 20/50rem;
      color: #ffffff;
      font-weight: 500;
    }
    &date-year{
      font-size: 18/50rem;
      padding-bottom: 4/50rem;
      position: relative;
      width: 66/50rem;
      height: 25/50rem;
      overflow: hidden;
      &-select{
        position: absolute;
        opacity: .7;
        &.active{
          opacity: 1;
        }
      }
    }
    &date-monthday{
      font-size: 26/50rem;
      position: relative;
      width: 100%;
      height: 36/50rem;
      overflow: hidden;
      &-select{
        position: absolute;
        opacity: .7;
        &.active{
          opacity: 1;
        }
      }
    }
    // &calendar-container{
    // }
    &calendar-toolbar{
      margin: 5/50rem 10/50rem 5/50rem 10/50rem;
      height: 40/50rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-title{
        position: relative;
        width: 100/50rem;
        height: 33/50rem;
        text-align: center;
        &-content{
          position: absolute;
          width: 100%;
          font-size: 16/50rem;
        }
      }
    }
    &calendar-svg{
      padding: 8/50rem;
      position: relative;
      height: 40/50rem;
      width: 40/50rem;
      &-icon{
        display: block;
        fill: currentColor;
        height: 24/50rem;
        width: 24/50rem;
        user-select: none;
        position: relative;
        z-index: 2;
      }
      &-cover{
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: #E0E0E0;
        border-radius: 50%;
        opacity: 0;
        display: inline-block;
      }
    }
    &calendar-week{
      width: 100%;
      font-size: 12/50rem;
      color: rgba(0,0,0,.87);
      opacity: .5;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 16/50rem;
      &-day{
        flex: 1;
        text-align: center;
      }
    }
    &calendar-monthday{
      padding-top: 10/50rem;
      font-size: 14/50rem;
      position: relative;
      width: 100%;
      min-height: 200/50rem;
      overflow: hidden;
      &-wrapper{
        position: absolute;
        width: 100%;
        height: 100%;
      }
      &-row{
        display: flex;
        justify-content: center;
        align-items: center;
        &-day{
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          position: relative;
          height: 35/50rem;
          &.pointer{
            cursor: pointer;
          }
          &-value{
            position: relative;
            z-index: 1;
          }
          &-cover{
            width: 25/50rem;
            height: 25/50rem;
            background-color: #ea3568;
            position: absolute;
            left: 14/50rem;
            top: 0.1rem;
            transform: translate3d(0, 0, 0);
            z-index: 0;
            border-radius: 50%;
            opacity: 1;
            display: block;
          }
          &.footstyle{
            color: #ea3568;
          }
          &.active{
            color: #ffffff;
          }
          &.disabled{
            opacity: .4;
            cursor: not-allowed;
          }
        }
      }
    }
    &calendar-year{
      height: 276/50rem;
      overflow: auto;
      li{
        padding: 10/50rem;
        text-align: center;
        font-size: 16/50rem;
        &.active{
          color: #00bcd4;
          font-size: 20/50rem;
          font-weight: bold;
        }
      }
    }
    &calendar-actions{
      padding: 0 20/50rem 15/50rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .btn{
        color: #00bcd4;
        margin-left: 40/50rem;
        font-size: 16/50rem;
        background-color: transparent;
      }
    }
  }
  .fadeX_Prev-enter-active, .fadeX_Prev-leave-active, .fadeX_Next-enter-active, .fadeX_Next-leave-active, .fadeY-enter-active, .fadeY-leave-active{
    transition: all .3s;
  }
  .fadeX_Prev-enter{
    transform: translateX(-100/50rem);
    opacity: 0;
  }
  .fadeX_Prev-leave-active{
    transform: translateX(100/50rem);
    opacity: 0;
  }
  .fadeX_Next-enter{
    transform: translateX(100/50rem);
    opacity: 0;
  }
  .fadeX_Next-leave-active{
    transform: translateX(-100/50rem);
    opacity: 0;
  }
  .fadeY-enter{
    transform: translateY(30/50rem);
    opacity: 0;
  }
  .fadeY-leave-active{
    transform: translateY(-30/50rem);
    opacity: 0;
  }
  .e_calendar_svg_btn-enter-active, .e_calendar_svg_btn-leave-active{
    transition: all 1s;
  }
  .e_calendar_svg_btn-enter{
    opacity: 1;
  }
  .e_calendar_day-enter-active{
      transition: all .2s;
    }
  .e_calendar_svg_btn-leave-active, .e_calendar_day-enter{
    opacity: 0;
  }
  .e_calendar_day-enter{
    width: 0;
    height: 0;
    transform: translate3d(12/50rem, 12/50rem, 0);
  }
</style>
