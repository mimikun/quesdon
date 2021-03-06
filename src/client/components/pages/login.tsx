import * as React from "react"
import { Alert, Button, FormGroup, Input, Label} from "reactstrap"
import { apiFetch } from "../../api-fetch"
import majorInstances from "../../major-instances"
import { Title } from "../common/title"

interface State {
    loading: boolean
}

export class PageLogin extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    render() {
        const { loading } = this.state
        return <div>
            <Title>ログイン</Title>
            <h1>ログイン</h1>
            <p>あなたのMastodon/Misskeyアカウントがあるインスタンスを入力してください。</p>
            <form action="javascript://" onSubmit={this.send.bind(this)}>
                <FormGroup>
                    <Input name="instance" placeholder="kirishima.cloud" list="major-instances"/>
                    <datalist id="major-instances">
                        {majorInstances.map((instance) => <option value={instance} />)}
                    </datalist>
                </FormGroup>
                <FormGroup check>
                <Label check>
                    <Input type="checkbox" name="misskey"　/>{' '}
                    Misskeyとしてログイン
                </Label>
                </FormGroup>
                <Button type="submit" color="primary" disabled={loading}>{ loading ? "読み込み中" : "ログイン" }</Button>
            </form>
            <p><a href="https://toot.app.thedesk.top/priv.html" target="_blank">プライバシーポリシー</a>や<a href="https://TheDesk/tos.html" target="_blank">利用規約</a>をご確認ください。</p>
        </div>
    }

    send(e: any) {
        const form = new FormData(e.target)
        this.callApi(form)
    }
    async callApi(form: FormData) {
        this.setState({
            loading: true,
        })
        function errorMsg(code: number | string) {
            return "ログインに失敗しました。入力内容をご確認の上、再度お試しください (" + code + ")"
        }
        const req = await apiFetch("/api/web/oauth/get_url", {
            method: "POST",
            body: form,
        }).catch((e) => {
            alert(errorMsg(-1))
            this.setState({
                loading: false,
            })
        })
        if (!req) return
        if (!req.ok) {
            alert(errorMsg("HTTP-" + req.status))
            this.setState({
                loading: false,
            })
            return
        }
        const urlRes = await req.json().catch((e) => {
            alert(errorMsg(-2))
            this.setState({
                loading: false,
            })
        })
        if (!urlRes) return
        location.href = urlRes.url
    }

    twitterLogin() {
        const form = new FormData()
        form.append("instance", "twitter.com")
        this.callApi(form)
    }
}
