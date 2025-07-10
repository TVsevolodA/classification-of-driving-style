import Image from 'next/image';

const Modal = ({ isOpen, onClose, resultPredict }) => {
    if (!isOpen) return null;

    function colorSelection(driveStyle: string) {
        switch (driveStyle) {
            case "Agressive":
                return "rgb(255, 0, 0)";
            case "Normal":
                return "rgb(0, 128, 0)";
            default:
                return "rgb(77, 77, 77)";
        }
    }

    const result: string = JSON.parse(resultPredict)["prediction_result"];
    const imagePath: string = `/${result}.jpg`;
    const dictResult = new Map ([
        [1,  'Агрессивный'],
        [2,  'Нормальный'],
        [3,  'Неопределенный'],
    ]);
    return (
        <div className="modal fade show"
                style={{ display: 'block' }}
                tabIndex={-1}
                role="dialog"
                aria-modal="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Ваш стиль вождения</h1>
                        <input type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Закрыть"
                                onClick={onClose}/>
                    </div>
                    <div className="modal-body"
                            style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
                        <h4>Результат предсказания:&nbsp;
                            <span style={{ color: colorSelection(result) }}>
                                {dictResult.get(Number(result))}
                            </span>
                        </h4>
                        <Image src={imagePath}
                                alt={result}
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: '80%', height: 'auto' }}
                        />
                    </div>
                    <div className="modal-footer" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <input type="button"
                                className="btn btn-primary"
                                onClick={onClose}
                                value="Попробовать снова"/>
                        <input type="button"
                                className="btn btn-primary"
                                value="На главную"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;