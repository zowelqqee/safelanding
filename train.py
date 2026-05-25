import torch 
import torch.nn as nn
import torch.optim as optim

from relocation_dataset import generate_dataset, get_feature_names, city_id_to_name

samples = generate_dataset(n=5000,seed=42)

X = torch.tensor([s['x'] for s in samples], dtype=torch.float32)
y = torch.tensor([s['y_scores'] for s in samples], dtype=torch.float32)
y_index = torch.tensor([s['y_index'] for s in samples], dtype=torch.long)

input_size = len(get_feature_names())
output_size = len(city_id_to_name)
split = int(len(samples) * 0.8)

X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
y_index_test = y_index[split:]


model = nn.Sequential(
    nn.Linear(input_size, 64),
    nn.ReLU(), 
    nn.Linear(64,64),
    nn.ReLU(),
    nn.Linear(64, output_size)
)

loss_fn = nn.KLDivLoss(reduction="batchmean")
optimizer = optim.Adam(model.parameters(), lr=0.001)

batch_size = 64

for epoch in range(150):
    perm = torch.randperm(len(X_train))

    for i in range(0, len(X_train), batch_size):
        idx = perm[i:i + batch_size]
        xb = X_train[idx]
        yb = y_train[idx]

        logits = model(xb)
        log_probs = torch.log_softmax(logits, dim=1)
        loss = loss_fn(log_probs, yb)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    if epoch % 5 == 0:
        with torch.no_grad():
            logits = model(X_test)
            pred = logits.argmax(dim=1)
            acc = (pred == y_index_test).float().mean().item()

            top5 = logits.topk(5, dim=1).indices
            top5_acc = (top5 == y_index_test.unsqueeze(1)).any(dim=1).float().mean().item()

        print(
            'epoch', epoch,
            'loss', round(loss.item(), 4),
            'acc', round(acc, 4),
            'top5', round(top5_acc, 4)
        )

torch.save(model.state_dict(), 'city_model.pt')
