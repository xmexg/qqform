const { createApp, ref, onMounted } = Vue

createApp({
    setup() {
        const loginMethod = ref('id')
        const cookie = ref('')
        const loginNumber = ref('正在获取登录码')
        const id = ref('')

        onMounted(() => {
            // 解析cookie
            const cookies = document.cookie.split(';').map(cookie => cookie.trim());
            for (const cookie of cookies) {
                const [name, value] = cookie.split('=');
                if (name === 'id') {
                    id.value = value;
                    break;
                }
            }
            if (id.value===''){
                loginById()
            }
        });

        const switchTab = (method) => {
            loginMethod.value = method;
        };

        const loginById = () => {
            // 实现ID登录的逻辑
            const idres = getloginNumber()
            while (idres) {
                const xhr = new XMLHttpRequest()
                xhr.open('GET', '/getCookieById', false)
                xhr.onload = () => {
                    if (xhr.status == 200){
                        const xhrjson = JSON.parse(xhr.responseText)
                        const xhrcookie = xhrjson['cookie']
                        if(xhrjson['code']==0 && xhrcookie){
                            cookie.value = xhrcookie
                            setCookie('id', idres)
                            setCookie('qqcookie', xhrcookie)
                            return xhrcookie
                        }
                    }
                }
                xhr.onerror = () => {
                    loginNumber.value = "无法发送请求"
                }
                try{
                    xhr.send()
                } catch {
                    loginNumber.value = "无法连接到服务器"
                }
                setTimeout(() => {}, 3000);
            }
        };

        const loginByCookie = () => {
            console.log('Cookie登录', cookie.value);
            // 实现Cookie登录的逻辑
        };

        const getloginNumber = () => {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', '/getId', false)
            xhr.onload = () => {
                console.log("123456")
                if (xhr.status == 200){
                    loginNumber.value = xhr.responseText
                    return xhr.responseText
                } else {
                    loginNumber.value = "无法获取cookie"
                }
            }
            xhr.onerror = () => {
                loginNumber.value = "无法发送请求"
            }
            try{
                xhr.send()
            } catch {
                loginNumber.value = "无法连接到服务器"
            }
            return null
        }

        const setCookie = (name, value) => {
            const date = new Date();
            date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000)); // 设置过期时间为一年后
            const expires = "; expires=" + date.toUTCString();
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        };

        return {
            loginMethod,
            id,
            cookie,
            loginNumber,
            switchTab,
            loginById,
            loginByCookie,
            getloginNumber,
            setCookie
        }
    }
}).mount('#app')