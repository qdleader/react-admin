import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite"
import react from "@vitejs/plugin-react"
// https://vitejs.dev/config/

// * Vite
declare type Recordable<T = any> = Record<string, T>

declare interface ViteEnv {
	VITE_API_URL: string
	VITE_PORT: number
	VITE_OPEN: boolean
	VITE_GLOB_APP_TITLE: string
	VITE_DROP_CONSOLE: boolean
	VITE_PROXY_URL: string
	VITE_BUILD_GZIP: boolean
	VITE_REPORT: boolean
}

// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: Recordable): ViteEnv {
	const ret: any = {}

	for (const envName of Object.keys(envConf)) {
		let realName = envConf[envName].replace(/\\n/g, "\n")
		realName = realName === "true" ? true : realName === "false" ? false : realName

		if (envName === "VITE_PORT") {
			realName = Number(realName)
		}
		if (envName === "VITE_PROXY") {
			try {
				realName = JSON.parse(realName)
			} catch (error) {
				console.log(error)
			}
		}
		ret[envName] = realName
		process.env[envName] = realName
	}
	return ret
}

export default defineConfig((mode: ConfigEnv): UserConfig => {
	const env = loadEnv(mode.mode, process.cwd())
	const viteEnv = wrapperEnv(env)
	return {
		plugins: [react()],
	}
})
