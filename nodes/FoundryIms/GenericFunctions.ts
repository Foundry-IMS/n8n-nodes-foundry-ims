import type { IDataObject, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

interface CustomValueEntry {
	fieldDefId: string;
	valueType: 'boolean' | 'clear' | 'date' | 'json' | 'number' | 'text';
	value?: string;
}

/**
 * Builds the PUT …/custom-values body. The API requires each value to be sent
 * in the ONE column the field's declared type reads (valueText for TEXT,
 * valueNumber for NUMBER, …) and rejects any other column with a 400 — so the
 * node asks for a value type and routes the raw string into the right column.
 * An entry with type "clear" sends no value column at all, which clears the
 * stored value.
 */
export async function buildCustomValuesBody(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const entries = this.getNodeParameter('values.entry', []) as CustomValueEntry[];
	if (entries.length === 0) {
		throw new NodeOperationError(this.getNode(), 'Add at least one value to set');
	}

	const values: IDataObject[] = entries.map((entry) => {
		const row: IDataObject = { fieldDefId: entry.fieldDefId };
		const raw = entry.value ?? '';
		switch (entry.valueType) {
			case 'text':
				row.valueText = raw;
				break;
			case 'number': {
				const parsed = Number(raw);
				if (!Number.isFinite(parsed)) {
					throw new NodeOperationError(
						this.getNode(),
						`Value for field ${entry.fieldDefId} is not a number: ${raw}`,
					);
				}
				row.valueNumber = parsed;
				break;
			}
			case 'boolean':
				row.valueBoolean = raw.trim().toLowerCase() === 'true';
				break;
			case 'date':
				row.valueDate = raw;
				break;
			case 'json':
				try {
					row.valueJson = JSON.parse(raw);
				} catch {
					throw new NodeOperationError(
						this.getNode(),
						`Value for field ${entry.fieldDefId} is not valid JSON`,
					);
				}
				break;
			case 'clear':
				break;
		}
		return row;
	});

	requestOptions.body = { values };
	return requestOptions;
}
