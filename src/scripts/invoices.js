/**
 * Created by groundlee on 2016/12/18.
 */

import invoiceApi from './invoice_api.js'


var tax_citys={
    '1100':{'code':'1100','sfmc':'北京','Ip':'https://zjfpcyweb.bjsat.gov.cn:443','address':'https://zjfpcyweb.bjsat.gov.cn:443'},
    '1200':{'code':'1200','sfmc':'天津','Ip':'https://fpcy.tjsat.gov.cn:443','address':'https://fpcy.tjsat.gov.cn:443'},
    '1300':{'code':'1300','sfmc':'河北','Ip':'https://fpcy.he-n-tax.gov.cn:82','address':'https://fpcy.he-n-tax.gov.cn:82'},
    '1400':{'code':'1400','sfmc':'山西','Ip':'https://fpcy.tax.sx.cn:443','address':'https://fpcy.tax.sx.cn:443'},
    '1500':{'code':'1500','sfmc':'内蒙古','Ip':'https://fpcy.nm-n-tax.gov.cn:443','address':'https://fpcy.nm-n-tax.gov.cn:443'},
    '2100':{'code':'2100','sfmc':'辽宁','Ip':'https://fpcy.tax.ln.cn:443','address':'https://fpcy.tax.ln.cn:443'},
    '2102':{'code':'2102','sfmc':'大连','Ip':'https://fpcy.dlntax.gov.cn:443','address':'https://fpcy.dlntax.gov.cn:443'},
    '2200':{'code':'2200','sfmc':'吉林','Ip':'https://fpcy.jl-n-tax.gov.cn:4432','address':'https://fpcy.jl-n-tax.gov.cn:4432'},
    '2300':{'code':'2300','sfmc':'黑龙江','Ip':'https://fpcy.hl-n-tax.gov.cn:443','address':'https://fpcy.hl-n-tax.gov.cn:443'},
    '3100':{'code':'3100','sfmc':'上海','Ip':'https://fpcyweb.tax.sh.gov.cn:1001','address':'https://fpcyweb.tax.sh.gov.cn:1001'},
    '3200':{'code':'3200','sfmc':'江苏','Ip':'https://fpdk.jsgs.gov.cn:80','address':'https://fpdk.jsgs.gov.cn:80'},
    '3300':{'code':'3300','sfmc':'浙江','Ip':'https://fpcyweb.zjtax.gov.cn:443','address':'https://fpcyweb.zjtax.gov.cn:443'},
    '3302':{'code':'3302','sfmc':'宁波','Ip':'https://fpcy.nb-n-tax.gov.cn:443','address':'https://fpcy.nb-n-tax.gov.cn:443'},
    '3400':{'code':'3400','sfmc':'安徽','Ip':'https://fpcy.ah-n-tax.gov.cn:443','address':'https://fpcy.ah-n-tax.gov.cn:443'},
    '3500':{'code':'3500','sfmc':'福建','Ip':'https://fpcyweb.fj-n-tax.gov.cn:443','address':'https://fpcyweb.fj-n-tax.gov.cn:443'},
    '3502':{'code':'3502','sfmc':'厦门','Ip':'https://fpcy.xm-n-tax.gov.cn','address':'https://fpcy.xm-n-tax.gov.cn'},
    '3600':{'code':'3600','sfmc':'江西','Ip':'https://fpcy.jxgs.gov.cn:82','address':'https://fpcy.jxgs.gov.cn:82'},
    '3700':{'code':'3700','sfmc':'山东','Ip':'https://fpcy.sd-n-tax.gov.cn:443','address':'https://fpcy.sd-n-tax.gov.cn:443'},
    '3702':{'code':'3702','sfmc':'青岛','Ip':'https://fpcy.qd-n-tax.gov.cn:443','address':'https://fpcy.qd-n-tax.gov.cn:443'},
    '4100':{'code':'4100','sfmc':'河南','Ip':'https://fpcy.ha-n-tax.gov.cn','address':'https://fpcy.ha-n-tax.gov.cn'},
    '4200':{'code':'4200','sfmc':'湖北','Ip':'https://fpcy.hb-n-tax.gov.cn:443','address':'https://fpcy.hb-n-tax.gov.cn:443'},
    '4300':{'code':'4300','sfmc':'湖南','Ip':'https://fpcy.hntax.gov.cn:8083','address':'https://fpcy.hntax.gov.cn:8083'},
    '4400':{'code':'4400','sfmc':'广东','Ip':'https://fpcy.gd-n-tax.gov.cn:443','address':'https://fpcy.gd-n-tax.gov.cn:443'},
    '4403':{'code':'4403','sfmc':'深圳','Ip':'https://fpcy.szgs.gov.cn:443','address':'https://fpcy.szgs.gov.cn:443'},
    '4500':{'code':'4500','sfmc':'广西','Ip':'https://fpcy.gxgs.gov.cn:8200','address':'https://fpcy.gxgs.gov.cn:8200'},
    '4600':{'code':'4600','sfmc':'海南','Ip':'https://fpcy.hitax.gov.cn:443','address':'https://fpcy.hitax.gov.cn:443'},
    '5000':{'code':'5000','sfmc':'重庆','Ip':'https://fpcy.cqsw.gov.cn:80','address':'https://fpcy.cqsw.gov.cn:80'},
    '5100':{'code':'5100','sfmc':'四川','Ip':'https://fpcy.sc-n-tax.gov.cn:443','address':'https://fpcy.sc-n-tax.gov.cn:443'},
    '5200':{'code':'5200','sfmc':'贵州','Ip':'https://fpcy.gz-n-tax.gov.cn:80','address':'https://fpcy.gz-n-tax.gov.cn:80'},
    '5300':{'code':'5300','sfmc':'云南','Ip':'https://fpcy.yngs.gov.cn:443','address':'https://fpcy.yngs.gov.cn:443'},
    '5400':{'code':'5400','sfmc':'西藏','Ip':'https://fpcy.xztax.gov.cn:81','address':'https://fpcy.xztax.gov.cn:81'},
    '6100':{'code':'6100','sfmc':'陕西','Ip':'https://fpcyweb.sn-n-tax.gov.cn:443','address':'https://fpcyweb.sn-n-tax.gov.cn:443'},
    '6200':{'code':'6200','sfmc':'甘肃','Ip':'https://fpcy.gs-n-tax.gov.cn:443','address':'https://fpcy.gs-n-tax.gov.cn:443'},
    '6300':{'code':'6300','sfmc':'青海','Ip':'https://fpcy.qh-n-tax.gov.cn:443','address':'https://fpcy.qh-n-tax.gov.cn:443'},
    '6400':{'code':'6400','sfmc':'宁夏','Ip':'https://fpcy.nxgs.gov.cn:443','address':'https://fpcy.nxgs.gov.cn:443'},
    '6500':{'code':'6500','sfmc':'新疆','Ip':'https://fpcy.xj-n-tax.gov.cn:443','address':'https://fpcy.xj-n-tax.gov.cn:443'}};

class Invoices {

    constructor(limit=20,offset=0) {
        this.init(limit,offset)
    }

    init(limit=20,offset=0){
        this.limit = limit;
        this.offset = offset;
        this.list = [];
        this.full = false;
        this.time = Date.parse( new Date());
        this.error_count = 0
    }

    get_swjg_from_fpdm(fpdm){
        if (!fpdm) return '未知税务机关'
        let dqdm=''
        if (fpdm.length == 12)
            dqdm = fpdm.substring(1,5)
        else if(fpdm.length == 10)
            dqdm = fpdm.substring(0,4)
        else
            return '未知税务机关'
        if(dqdm!="2102"&&dqdm!="3302"&&dqdm!="3502"&&dqdm!="3702"&&dqdm!="4403"){
            dqdm=dqdm.substring(0,2)+"00";
        }
        let swjg = tax_citys[dqdm]
        if (swjg && (!!swjg['sfmc']))
            return swjg['sfmc']
        return '未知税务机关'
    }

    get_fplx_from_fpdm(fpdm){
        //如果是 // 04,10,11 输入校验码后6位。 01，02，03，99 输入金额
        let fplx = ["99","未知发票类型"]
        if (!fpdm) return fplx
        let b = fpdm.substring(7,8)
        if (fpdm.length == 12){
            if (fplx[0] == "99") {//:  #增加判断，判断是否为新版电子票
                if (fpdm[0] == '0' && fpdm.substring(10,12) == '11')
                    fplx = ["10","增值税普通发票（电子）"]
                if (fpdm[0] == '0' && (fpdm.substring(10,12) == '06' || fpdm.substring(10,12) == '07'))//: #判断是否为卷式发票  第1位为0且第11-12位为06或07
                    fplx = ["11","增值税普通发票（卷票)"]
            }
            if (fplx[0]=="99"){//:   #如果还是99，且第8位是2，则是机动车发票
                if (b=='2' && (fpdm[0] != '0'))
                    fplx = ["03","机动车销售统一发票"]
            }
        }
        else if (fpdm.length == 10){
            if (b=='1' || b=='5')
                fplx = ["01","增值税专用发票"]
            else if (b=='6' || b=='3')
                fplx = ["04","增值税普通发票"]
            else if  (b=='7' || b=='2')
                fplx = ["02","货物运输业增值税专用发票"]
        }
        return fplx
    }
    /**
     * 如果是 // 04,10,11 输入校验码后6位。 01，02，03，99 输入金额
     * @param {*} fpdm
     */
    isInputJYM(fpdm){
        if(!this.isFpdmOK(fpdm))
            return false

        let fplx = this.get_fplx_from_fpdm(fpdm)
        if ((fplx[0]=='01')||(fplx[0]=='02')||(fplx[0]=='03')||(fplx[0]=='99'))
            return false
        return true
    }

    bc(a){
        let b;
        let d=new Date();
        let e=d.getFullYear();
        let f=e.toString();
        let g=f.substring(2);
        if(a.length==12){
            b=a.substring(5,7);
        }else{
            b=a.substring(4,6);
        }
        //console.log(b + " " + g);
        //if(b<=00||b>g){
        //    return false;
       // }
        return true;
    }
    //判断是否为数字
    isNum(s)
    {
        if (s!=null && s!="")
        {
            return !isNaN(s);
        }
        return false;
    }

    isFpdmOK(fpdm){
        if(!this.isNum(fpdm))
            return false
        if (fpdm.length!=10 && fpdm.length!=12)
            return false
        if (!this.get_swjg_from_fpdm(fpdm)) return false
        if (this.get_fplx_from_fpdm(fpdm)[0] == '99') return false



        let b=/^1|0\d{11}$|^\d{6}[1-9]\d{2}0$/;
        let c=/^0{8}[1-9]?\w[1-9]\d*$/;

        let e=b.test(fpdm);
        let f=c.test(fpdm);
        return e  && this.bc(fpdm)
    }

    isFphmOK(fphm){
        let b=/^\d{8}$/;
        let c=/^0{8}$/;
        let d=/^0{11}-?[1-9]*\w\d*$/;
        let e=b.test(fphm);
        let f=c.test(fphm);
        if(e==true&&f==false){
            return true;
        }else{
            return false;
        }
    }

    ca(i){//shit code
        let a = new Date();
        let b = 0;
        let c = 0;
        let d = 0;
        let e = "";
        b= a.getFullYear()-i;
        c= a.getMonth()+1;
        d = a.getDate();
        e += b;
        if (c >= 10 ){
            e += c;
        }else{
            e += "0" + c;
        }
        if (d >= 10 ){
            e += d ;
        }else{
            e += "0" + d ;
        }
        return e;
    }
    cb(a,b,c){//shit code
        if(c>31){
            return false;
        }else if(c<1){
            return false;
        }else{
            if(b==2){
                if(c>29){//2月不会超过29
                    return false;
                }
                if (((a % 4)==0) && ((a % 100)!=0) || ((a % 400)==0)) {//闰年1--29
                    return true;
                }else{//平年1--28
                    if(c>28){
                        return false;
                    }
                }
            }else if((b==4||b==6||b==9||b==11)&&c>30){
                return false;
            }
        }
        return true;
    }

    isKprqOK(kprq){//shit code
        kprq = kprq.replace(new RegExp('-',"gm"),'')
        let b=/^\d{8}$/;
        let c=/^0{8}$/;
        let d=/^0{11}-?[1-9]*\w\d*$/;
        let e=b.test(kprq);
        if(e==true){
            let g=new Date();
            let h=g.getFullYear();
            let i=g.getMonth()+1;
            let j=g.getDate();
            let k=kprq.substring(0,4);
            let l=parseInt(kprq.substring(4,6), 10);
            let m=parseInt(kprq.substring(6), 10);
            let n=this.ca(0);
            let t=this.ca(1);
            if((h!=k&&h-1!=k)||l == 0 || l>12|| m == 0 || m>31 || kprq>n||!this.cb(k,l,m)||(h==k && i== l && j==m)){
                return false;
            }
            if(h-1==k&&a<=t){
                return false;
            }
            return true;
        }else{
            return false;
        }
    }

    isFull(){
        return this.full
    }

    getList(){
        return this.list
    }

    removeFromList(id){
        let self = this
        this.list.forEach(function(invoice, index) {
            if(id === invoice.id) {
                self.list.splice(index,1)
                return
            }
        });
    }

    getInvoice(id){
        return invoiceApi.getInvoice({},{id:id})
    }

    loadMore(){
        /*
        "count": 22,
        "next": "http://127.0.0.1:8000/invoice/invoice/?limit=20&offset=20",
        "previous": null,
        "results": []
        */

        // if ((Date.parse( new Date())- this.time)<=0){
        //     return
        // }

        if (this.error_count > 10){
            return new Promise((resolve, reject)=> {
                reject('错误次数超量！')
            })
        }
        this.time = Date.parse( new Date());
        let self = this;
        let pRet = new Promise((resolve, reject)=> {
            if (this.full){
                reject('没有更多的数据啦！')
                return
            }
            let p = invoiceApi.getInvoices({offset:this.offset,limit:this.limit})
            p.then(
                (ret)=>{
                    self.list = self.list.concat(ret.results)
                    self.offset += ret.results.length
                    if (ret.count == self.list.length){
                        self.full = true
                    }
                    resolve(self.list)
                },
                (ret)=>{
                    self.error_count += 1
                    reject(ret)
                })

        })
        return pRet

    }

}


const invoices = new Invoices()

export default invoices
