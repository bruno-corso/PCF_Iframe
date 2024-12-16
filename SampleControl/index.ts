import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class IframeControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _iframe: HTMLIFrameElement;
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;

    /**
     * Método para inicializar o controle e definir o iframe.
     * @param context - O contexto do controle.
     * @param notifyOutputChanged - Callback para alertar o framework sobre mudanças.
     * @param state - Estado do controle.
     * @param container - O container onde o controle será renderizado.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;

        container.style.height = "100%"
        // Definir o estilo do _container para ocupar 100% da altura
        this._container = document.createElement("div");
        this._container.style.height = "100%";
        this._container.style.width = "100%";
        this._container.style.display = "flex";  // Usando flexbox para garantir que o iframe se estique

        console.log("Altura inicial do container:", container.offsetHeight);

        // Cria o iframe
        this._iframe = document.createElement("iframe");
        this._iframe.style.width = "100%"; // Garante que o iframe ocupe 100% de largura
        this._iframe.style.border = "none"; // Remove a borda do iframe


        // Adiciona o evento de resize para garantir que o iframe se ajuste
        window.addEventListener("resize", this.onResize.bind(this));

        // Define o URL do iframe com base na propriedade "iframeUrl" do controle
        const iframeUrl = context.parameters.iframeUrl.raw;
        if (iframeUrl) {
            this._iframe.src = iframeUrl;
        }

        // Adiciona o iframe ao container
        this._container.appendChild(this._iframe);
        container.appendChild(this._container);
    }

    /**
     * Método chamado quando o controle é atualizado.
     * Atualiza o URL do iframe se a propriedade de URL mudar.
     * @param context - O contexto atualizado do controle.
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const iframeUrl = context.parameters.iframeUrl.raw;
        if (iframeUrl && iframeUrl !== this._iframe.src) {
            this._iframe.src = iframeUrl;
        }
    }

    /**
     * Método chamado quando o tamanho do iframe ou do controle muda (redimensionamento da janela).
     */
    private onResize(): void {
        this._iframe.style.width = "100%";
        this._iframe.style.height = "100%";
    }

    /**
     * Método chamado para obter os outputs do controle (não utilizado neste exemplo).
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Método chamado para destruir o controle, removendo eventos e limpando recursos.
     */
    public destroy(): void {
        window.removeEventListener("resize", this.onResize.bind(this));
    }
}
