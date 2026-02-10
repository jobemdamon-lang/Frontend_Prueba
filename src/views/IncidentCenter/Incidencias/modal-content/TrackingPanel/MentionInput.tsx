import { FC } from "react";
import { Mention, MentionsInput } from "react-mentions";

type Props = {
    data: { id: string, display: string }[]
    inputValue: string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>
}

const MentionInput: FC<Props> = ({ data, inputValue, setInputValue }) => {

    return (
        <div className="w-75">
            <MentionsInput
                style={mentionsInputStyles}
                value={inputValue}
                onChange={(event: any) => setInputValue(event.target.value)}>
                <Mention
                    trigger={"@"}
                    style={mentionStyles}
                    data={data}
                />
            </MentionsInput>
        </div>
    )
};

export { MentionInput };

const mentionStyles = {
    backgroundColor: "#cee4e5",
};

const mentionsInputStyles = {
    control: {
        backgroundColor: '#ffffff',
    },
    input: {
        borderRadius: "10px",
        fontSize: "1.2rem"
    },
    '&multiLine': {
        control: {
            minHeight: 63,
        },
        highlighter: {
            padding: 9,
            border: '1px solid transparent',
        },
        input: {
            padding: 9,
            border: '1px solid silver',
        },
    },
    '&singleLine': {
        display: 'inline-block',
        width: 180,
        highlighter: {
            padding: 1,
            border: '1px inset transparent',
        },
        input: {
            padding: 1,
            border: '2px inset',
        },
    },
    suggestions: {
        list: {
            borderRadius: '10px',
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.15)',
            fontSize: 16,
            maxHeight: "300px",
            overflowY: "scroll"
        },
        item: {
            padding: "5px",
            margin: "3px",
            borderRadius: "8px",
            '&focused': {
                backgroundColor: 'RGB(221, 231, 236)',
            },
        },
    },
}
