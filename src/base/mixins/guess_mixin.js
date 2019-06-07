import sharefn from 'common/js/sharefn'
import { getDataList as getMoneyArr } from 'common/api/apidata'

const guessMixins = {
  data () {
    return {
      moneyArr: []
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    guessTeamClick () {
      //console.log('聊天室进来的');
      if (sharefn.isLogin()) {
        this.$refs.guessDialog.show(arguments)
      } else {
        layer.open({
          content: '您还没有登录请先登录！',
          btn: ['确定', '取消'],
          yes: (index) => {
            this.$router.push('/enter')
            layer.close(index)
          },
          no: index => layer.close(index)
        });
      }
    },
    getDataList () {
      getMoneyArr().then(res => {
        this.moneyArr = res['bet.prices.list']
      })
    }
  }
}

export default guessMixins
