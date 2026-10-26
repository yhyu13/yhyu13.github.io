---
title: Transformers and LLM foundations
source: https://cs2680.seas.harvard.edu/notes/transformers.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# Transformers and LLM foundations
CS2680 Modern AI Systems — Transformers and LLM Foundations

CS2680 Modern AI Systems

# Transformers and LLM foundations

Optional background readings · [Course readings](../readings.html)

This optional reading guide brings together the material from the former October 19 LLM lecture. The architecture groups explain what one forward pass costs. The remaining groups cover how large to make the model and how long to train it, what it is trained on, and what is done to it after pretraining. Those choices shape the workload Part II serves. Read the scaling group for where the compute goes, the data group for what open corpora and open checkpoints let you inspect, and the post-training and reasoning groups for why a request today emits many more decode tokens than a request in 2020 did.

The last two groups have to be read together. The evaluation group is about whether a reported number means anything, which is the same skill class discussions and the final project are graded on. The model reports are where the architecture, data, and post-training decisions above appear as shipped systems, and reading several of them side by side is the fastest way to see how much a report discloses and how much it withholds. The DeepSeek and Qwen3 reports sit with the mechanisms they introduced rather than being repeated there.

## Foundations

### [Transformer](https://arxiv.org/abs/1706.03762) (2017)

*Attention Is All You Need*

**Background.** Sequence models before this paper were recurrent or convolutional, with attention bolted on top as a way for a decoder to look back at the encoder's states.

**Problem.** Recurrence forces computation to proceed one position at a time, so training cannot fill a parallel machine, and a dependency between distant tokens has to survive every intermediate step to reach the other end.

**Key idea.** Drop recurrence and convolution and build the model from self-attention plus position-wise feed-forward layers, with position supplied explicitly. Every position attends to every other inside one matmul-heavy block, and identical blocks stack.

**Findings.** On WMT 2014 English-to-German translation, the Transformer reaches 28.4 BLEU, more than 2 BLEU above the previous best result, including ensembles. On English-to-French, one model reaches 41.8 BLEU after 3.5 days of training on eight GPUs.

**Why it matters.** This is the architecture the whole course optimizes. Read it for shapes, not for BLEU scores: which operations are matmuls, which are attention, and what has to be kept around from one token to the next. Attention's quadratic cost and that per-token state are the two facts everything downstream reacts to.

**Adoption.** PyTorch's nn.TransformerEncoderLayer, Hugging Face Transformers, and vLLM implement the block layout directly.

### [Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) (2018)

*The Illustrated Transformer*

**Background.** The Transformer paper states its architecture as equations over tensors, assuming you can already hold shapes, batching, and multi-head projections in your head while you read.

**Problem.** Read that way, the hard part is not the mathematics but the bookkeeping: which axis carries the head, where the sequence dimension goes, and how the query, key, and value projections line up. Equations hide exactly the part a systems reader needs.

**Key idea.** Walk the same computation as pictures, one tensor at a time, from tokens and embeddings through self-attention and multiple heads to the decoder stack. Each step shows the array being reshaped rather than the formula that produces it.

**Why it matters.** It is the fastest visual route to the shapes, and shapes are what the rest of this page reasons about. Read it before the papers if tensor shapes are not yet automatic; it is standard onboarding material for courses and for industry reading groups.

### [Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/) (2018)

*The Annotated Transformer*

**Background.** Harvard NLP's annotated implementation sets the text of *Attention Is All You Need* beside the code that implements each part, in the order the paper presents it.

**Problem.** An architecture description leaves the mechanical details unstated: masking, initialization, the label-smoothed loss, and the learning-rate warmup. Those details decide whether an implementation trains at all, and none of them are visible in the equations.

**Key idea.** Implement the original architecture line by line and annotate each choice in place. The code connects the equations in *Attention Is All You Need* to executable modules and tensor operations while making implicit details explicit.

**Why it matters.** It is the shortest path from the paper to something you can run and instrument, which is where every measurement in this course begins. Harvard NLP still maintains it as a teaching reference, and reading the code is how minGPT and nanoGPT get used too.

### [GPT-1](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf) (2018)

*Improving Language Understanding by Generative Pre-Training*

**Background.** Before this paper, natural language processing built a separate model per task, trained on that task's labeled data, usually with a task-specific architecture stacked on pretrained word vectors. Unlabeled text was abundant; labels for any one task were not.

**Problem.** Supervised task models need labels, and labels are the scarce resource. Pretrained word vectors transfer only the lowest layer, so every new task still pays for its own architecture and its own annotated corpus.

**Key idea.** The decoder-only recipe in its first form. Pretrain one Transformer decoder as a language model on unlabeled text, then fine-tune the whole model with a small head per task, feeding structured inputs as ordered token sequences rather than changing the architecture.

**Why it matters.** Read it for the point at which the task-specific architecture starts to disappear. Once the same weights serve every task and only the input format changes, capability becomes a property of one pretrained model, which is the assumption every serving system on this page is built on.

### [GPT-2](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) (2019)

*Language Models are Unsupervised Multitask Learners*

**Background.** The GPT-1 recipe was to pretrain on unlabeled text and then fine-tune a small task-specific head, so every task a system offered shipped its own training run and its own set of weights.

**Problem.** That makes deployment scale with the number of tasks. Each new task needs labeled data, a fine-tuning run, and a separate checkpoint to serve, and nothing generalizes to a task nobody trained for.

**Key idea.** Drop the fine-tuning step. Train one large decoder-only language model on a broad web corpus and ask that single set of weights to do many tasks from the prompt alone, with no gradient update at inference.

**Why it matters.** That claim is what lets a serving system run a single model for every workload, which is the assumption underneath every optimization in Part II. Without it, serving is a fleet of task-specific models rather than one engine to optimize.

**Adoption.** GPT-2 is still the smoke-test model in Hugging Face Transformers and vLLM test suites, and it is the architecture nanoGPT and llm.c train from scratch.

### [GPT-3](https://arxiv.org/abs/2005.14165) (2020)

*Language Models are Few-Shot Learners*

**Background.** GPT-2 had shown that one set of weights could attempt many tasks from the prompt, at modest scale and with uneven results across tasks.

**Problem.** Adapting a model to a new task still meant a gradient update, which puts a training pipeline between a user and any task the model has not already been fine-tuned for.

**Key idea.** Scale the model and supply the task in the prompt instead. A handful of worked examples placed in the context specifies the task, and the weights never change.

**Why it matters.** This is where in-context learning came from, and therefore why prompts got long enough that caching them pays. The context becomes the interface, so prefill becomes a cost you have to budget rather than a fixed startup fee.

**Adoption.** Few-shot prompting is a standard interface across LLM APIs and is implemented directly by prompt-template libraries including LangChain.

### [BERT](https://arxiv.org/abs/1810.04805) (2018)

*Pre-training of Deep Bidirectional Transformers for Language Understanding*

**Background.** Pretrained language models before this read text in one direction, because the training objective was to predict the next token from the tokens before it.

**Problem.** One-directional conditioning throws away half the context for tasks where you already hold the whole input. For classifying a span or answering a question about a passage, the words after a position matter as much as the words before it.

**Key idea.** Train an encoder with a masked objective: hide a fraction of the tokens and predict them from both directions at once. The output is one representation per input token rather than a continuation of the text.

**Why it matters.** It is the useful contrast to every decoder-only system on this page. There is no autoregressive decode, so no KV cache and none of the serving problems in Part II. The whole input is one forward pass with a known cost.

**Adoption.** Encoder-only models still run retrieval systems: sentence-transformers uses them for embeddings, and cross-encoder rerankers use the same bidirectional stack to score query-document pairs.

### [T5](https://arxiv.org/abs/1910.10683) (2019)

*Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer*

**Background.** By 2019 transfer learning for text had produced a large collection of pretraining objectives, corpora, and architectures, each published with its own task-specific output layer and its own experimental setup.

**Problem.** None of those results were comparable. Two papers differed in objective, data, model size, and fine-tuning protocol at once, so a reported gain could not be attributed to any single decision.

**Key idea.** Write every task as text in and text out, over an encoder-decoder rather than a decoder-only stack. That one interface makes objectives, corpora, and architectures substitutable, so a single sweep can compare them under one budget.

**Why it matters.** The contribution is the sweep rather than any one number in it, and it is a model for how a systems claim should be argued. Fix the budget, vary one thing, and report the comparison instead of arguing about it.

**Adoption.** Stable Diffusion 3 and FLUX use T5 encoders as text towers, an external deployment of the model beyond text generation.

## Tokenization

### [BPE](https://arxiv.org/abs/1508.07909) (2015)

*Neural Machine Translation of Rare Words with Subword Units*

**Background.** Neural translation systems worked over a fixed word vocabulary of tens of thousands of entries, with every word outside that list collapsed into a single unknown token.

**Problem.** Rare words, names, and inflected forms fall outside any fixed word list, and a model cannot produce a word it has only ever seen as unknown. Enlarging the vocabulary moves the boundary without removing it.

**Key idea.** Build the vocabulary from characters upward. Repeatedly merge the most frequent adjacent pair until the vocabulary is full, so frequent words end up whole and rare ones decompose into pieces the model has already seen.

**Why it matters.** Tokenization is where a user's text becomes a token count, and that count is what the serving system prefills, caches, and bills for. Every sequence length in this course is denominated in units this algorithm chose.

**Adoption.** Byte-level BPE is the tokenizer for GPT-2 through GPT-4 and for Llama 3, and OpenAI's tiktoken and Hugging Face's tokenizers library both implement the merge algorithm directly.

### [SentencePiece](https://arxiv.org/abs/1808.06226) (2018)

*A simple and language independent subword tokenizer and detokenizer for Neural Text Processing*

**Background.** Subword algorithms like BPE were published as procedures over pre-tokenized text, so each pipeline supplied its own word splitter, usually one written for English and its punctuation conventions.

**Problem.** A pre-tokenizer that sits outside the vocabulary breaks two things. First, detokenization becomes a guess about where the spaces were. Second, languages that do not delimit words with whitespace need a separate segmenter before the tokenizer can run at all.

**Key idea.** Treat the input as a raw stream and put whitespace inside the vocabulary itself. With no language-specific pre-tokenization, detokenization is exact and one vocabulary covers many languages.

**Why it matters.** It is the implementation most model families ship, so it is the tokenizer you will meet inside a serving stack. Exact reversibility is what lets a token count correspond to text you can hand back to a user unchanged.

**Adoption.** SentencePiece is the tokenizer shipped with T5, Llama 1 and 2, Mistral, and Gemma, and Hugging Face Transformers loads its model files directly for those families.

### [Dolma](https://arxiv.org/abs/2402.00159) (2024)

*an Open Corpus of Three Trillion Tokens for Language Model Pretraining Research*

**Background.** Trillion-token pretraining corpora existed, but the decisions behind them, what was filtered, what was deduplicated, and what was kept, were largely undocumented and the pipelines that produced them unreleased.

**Problem.** You cannot reason about a tokenizer, or about the sequence lengths a model will actually be served, without the corpus it was fit to. Closed data makes any claim about vocabulary coverage or tokens per word unverifiable.

**Key idea.** Release three trillion tokens together with the curation decisions and processing toolkit, then measure one tokenizer against the whole corpus in §5.

**Findings.** Of 50,280 vocabulary entries, 223 never occur in the corpus, about 0.4%, and most of those are whitespace combinations. Fertility, the number of tokens produced per word, differs by source and is highest on code.

**Why it matters.** Both carry into Part II. Fertility is the conversion factor between the text a user sends and the sequence length you have to serve, so it sets prefill work and cache footprint before any optimization applies, and the unused entries are vocabulary you allocated and never use.

### [SuperBPE](https://arxiv.org/abs/2503.13423) (2025)

*Space Travel for Language Models*

**Background.** Every subword tokenizer in production splits on whitespace before it merges, so a token can never span a space and the vocabulary is a list of pieces of single words.

**Problem.** That constraint puts a floor under the number of tokens a given text costs, and no merge schedule can go below it. Expressions that always occur together still pay one token each, and the sequence you prefill, cache, and bill for stays longer than the text requires.

**Key idea.** Drop the assumption that a token stays inside a word. A pretokenization curriculum learns subwords first and then superwords that bridge whitespace.

**Findings.** At a fixed 200k vocabulary it encodes text in up to 33% fewer tokens than BPE. An 8B model trained at matched size, vocabulary, and compute averages 4.0 points better across 30 downstream tasks while spending 27% less compute at inference.

**Why it matters.** Fertility is a design parameter, not a property of the language. Crossing word boundaries can improve both model quality and serving cost instead of trading one for the other.

### [BLT](https://arxiv.org/abs/2412.09871) (2024)

*Byte Latent Transformer: Patches Scale Better Than Tokens*

**Background.** A tokenizer is a preprocessing step fit once to a corpus, and every cost downstream is denominated in the units it chose. Working directly on bytes removes that step, at the price of a much longer sequence for the same text.

**Problem.** Bytes are not equally hard to predict, so spending the same computation on each one wastes most of it. A byte-level model needs some way to concentrate work on the difficult regions of a sequence and skim the easy ones.

**Key idea.** Bytes grouped into dynamically sized patches, segmented by the entropy of the next byte, so more compute lands where the data is harder. The paper is the first FLOP-controlled scaling study of byte-level models, to 8B parameters and 4T training bytes.

**Why it matters.** Read it for what a serving system loses and gains when there is no fixed vocabulary. The unit you prefill, cache, and bill for is chosen by the model rather than by a tokenizer, which turns sequence length into a runtime property instead of a fixed conversion.

### [H-Net](https://arxiv.org/abs/2507.07955) (2025)

*Dynamic Chunking for End-to-End Hierarchical Sequence Modeling*

**Background.** Tokenization sits outside the model. BPE fixes a vocabulary before training starts, and the byte-level alternatives above still hand the job to a separate component; BLT cuts patches with an entropy model that is not the main network.

**Problem.** A segmentation the training objective cannot see is a segmentation nobody can tune. Whitespace-then-merge is weakest on writing systems without spaces, on code, and on DNA, and a hand-built patcher inherits the fault, since its boundaries are fixed before training.

**Key idea.** Learn the segmentation jointly with everything else, which removes the tokenizer from the pipeline rather than replacing it. A dynamic chunking mechanism decides where to cut, trained through the same objective as the rest of the network.

**Findings.** Compute- and data-matched, one byte-level stage beats a strong BPE Transformer, and iterating the hierarchy matches a token-based Transformer of twice the size. On DNA, data efficiency is nearly 4× the baselines.

**Why it matters.** The gains are largest exactly where the whitespace heuristic is weakest, Chinese, code, and DNA, which is also where the Dolma fertility numbers above are worst. Segmentation is therefore learnable, and the unit you prefill, cache, and bill for is no longer fixed upstream.

## Architecture

### [RoPE](https://arxiv.org/abs/2104.09864) (2021)

*RoFormer: Enhanced Transformer with Rotary Position Embedding*

**Background.** Attention is permutation invariant, so position has to be injected by hand. The original Transformer added a sinusoidal or learned position vector to the token embedding before the first layer.

**Problem.** An added vector encodes an absolute index, while an attention score wants the relative distance between two tokens. Position therefore arrives as a term in the input rather than in the score it is supposed to shape.

**Key idea.** Rotate each query and key vector by an angle proportional to its position, so the dot product between them depends only on the offset between the two. Position enters the score as a rotation instead of an added term, and keys are rotated before they are written to the cache.

**Why it matters.** This is why KV entries are position-encoded rather than position-free, which constrains how cached prefixes can be reused. A cached block carries the offsets it was written at, so sharing it across a different position in another prompt is not a matter of copying bytes, a constraint every prefix-reuse scheme later in the course has to work around.

**Adoption.** RoPE is the position encoding in Llama, Qwen, Mistral, Gemma, and DeepSeek, and its long-context rescalings (NTK and YaRN) are what vLLM and Hugging Face expose as rope\_scaling.

### [ALiBi](https://arxiv.org/abs/2108.12409) (2021)

*Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation*

**Background.** A model only ever sees sequences up to its training length, and both learned and sinusoidal position encodings are defined by what happened at those offsets.

**Problem.** Run past the training length and quality falls off, so the context window is effectively fixed when training ends. Extending it means retraining or reworking the position encoding after the fact.

**Key idea.** Remove position embeddings entirely and instead subtract from each attention score a penalty that grows linearly with the query-key distance, using a fixed slope per head. Nothing about position is learned and the bias is defined at any distance, so a model trained on short sequences runs on long ones.

**Why it matters.** It makes extrapolation a property of the scoring function rather than a fine-tuning step, and it shows how much of what a model needs from position is a recency prior. Read it against RoPE with rescaling as the alternative positional scheme aimed at the same target, one built in and one bought afterwards.

**Adoption.** BLOOM and MosaicML's MPT use ALiBi, and Hugging Face Transformers implements it for both model families.

### [RMSNorm](https://arxiv.org/abs/1910.07467) (2019)

*Root Mean Square Layer Normalization*

**Background.** Every Transformer block is wrapped in LayerNorm, which subtracts the mean of an activation, divides by its standard deviation, then applies a learned gain and bias.

**Problem.** Normalization costs almost no arithmetic and a full read and write of the activation tensor, so it is bound by memory traffic. LayerNorm also computes two statistics, and the paper argues that the re-centering one earns little: the invariance that matters is to re-scaling.

**Key idea.** Drop the mean subtraction and the bias. Divide the activation by its root mean square and apply a learned gain, which keeps the re-scaling invariance while removing one reduction and several elementwise operations.

**Why it matters.** It is the standard example of a memory-bound operation worth fusing, since nearly all of its cost is the trip to memory rather than the maths; a small paper that shows up in every fusion discussion. It also sets the pattern for the rest of the block: cheap ops are judged by bytes moved, not by FLOPs.

**Adoption.** RMSNorm replaced LayerNorm in Llama, Qwen, Mistral, Gemma, and DeepSeek, and fused RMSNorm kernels ship in vLLM, FlashInfer, and NVIDIA's Transformer Engine.

### [SwiGLU](https://arxiv.org/abs/2002.05202) (2020)

*GLU Variants Improve Transformer*

**Background.** The feed-forward block in the original Transformer is two weight matrices with a ReLU between them: project up to a wider hidden dimension, apply the nonlinearity, project back down.

**Problem.** That nonlinearity was inherited rather than argued for, and the block holds most of a model's parameters and most of its prefill FLOPs. Anything that buys quality per parameter there is worth having, and anything that changes its shape changes the whole cost model.

**Key idea.** Replace the single nonlinearity with a gated linear unit. Two separate projections of the input are multiplied elementwise, one of them passed through Swish first, and the product is projected back down. That is why the MLP block has three weight matrices instead of two.

**Why it matters.** It changes the FLOP and parameter accounting of the block you spend the most on, so any roofline estimate or memory budget for a current model has to count three projections rather than two. The paper offers no mechanism for why gating helps, and says so; the field adopted it on the measurement alone.

**Adoption.** SwiGLU is the MLP in PaLM, Llama, Qwen, Mistral, and Gemma, and fused gate-up-and-multiply kernels for it ship in vLLM and Unsloth.

### [MQA](https://arxiv.org/abs/1911.02150) (2019)

*Fast Transformer Decoding: One Write-Head is All You Need*

**Background.** Multi-head attention gives every head its own query, key, and value projections, so a decode step reads one key and one value vector per head, per layer, for every token already in the sequence.

**Problem.** Decoding produces one token at a time, so there is no batch of queries to amortize that read against; the arithmetic per byte fetched is tiny and the step is limited by memory bandwidth. The cache also grows with heads times layers times context, so it, not the weights, decides how many sequences fit.

**Key idea.** Multi-query attention gives every query head a single shared key/value head. Queries stay multi-head and the keys and values collapse to one, which divides the per-token KV cache by the number of query heads and divides the bytes a decode step must read by the same factor.

**Why it matters.** It is the first entry on this list to treat decode memory traffic rather than FLOPs as the quantity worth optimizing. After it, KV bytes are a term you design against, not a consequence of the model you happened to train.

**Adoption.** MQA shipped as the key/value layout in PaLM, Falcon-7B, and StarCoder.

### [GQA](https://arxiv.org/abs/2305.13245) (2023)

*Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints*

**Background.** Multi-head attention pays a key/value pair per query head and is bandwidth-bound at decode. Multi-query attention collapses them to one and cuts the cache by the head count.

**Problem.** Both ends of that range are unsatisfying: the full layout is too expensive to serve, and a single shared key/value head gives up quality. Neither can be had from a model already trained in the other shape without pretraining again, which nobody wants to pay for to change a cache layout.

**Key idea.** Group the query heads, give each group its own key/value head, and uptrain an existing multi-head checkpoint into that shape. The number of groups is a dial between cache size and quality, and reaching a new setting costs a short continued-training run rather than a new pretrain.

**Findings.** Converting to eight key/value groups uses 5% of the original pretraining steps, preserves the seven-task score (47.1 versus 47.2), and reduces time per sample from 1.51 seconds to 0.28.

**Why it matters.** Read it for the argument that KV-cache size is a design parameter rather than a consequence. You choose the number of key/value heads against a serving budget, and you can convert a trained model to that choice afterwards, which is why this is the shape the open-weight families settled on.

**Adoption.** Llama 2 70B, Llama 3, Qwen 2.5, and Mistral use grouped-query attention, and Hugging Face Transformers, vLLM, and llama.cpp support the layout directly.

### [DeepSeek-V2 / MLA](https://arxiv.org/abs/2405.04434) (2024)

*DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model*

**Background.** By 2024 grouped-query attention was the standard way to shrink the KV cache, sharing one key/value head across a group of query heads. A cache entry was still a key vector and a value vector, per group, per layer, per token.

**Problem.** Sharing heads divides the cache by a constant, and long-context serving wants a much larger factor than that constant can safely reach; cutting groups further costs quality. To go beyond it, the shape of a cache entry has to change, not just how many entries there are.

**Key idea.** Multi-head latent attention caches one low-rank latent vector per token instead of full keys and values, and projects it back up inside the attention computation.

**Findings.** Against DeepSeek 67B the paper reports a 93.3% smaller KV cache and 5.76× higher maximum generation throughput.

**Why it matters.** It changes what a cache entry is, which matters for anything that wants to share, move, or evict cached prefixes. As a report, 236B total parameters with 21B activated per token, it is also the clearest case here of a lab arguing an architecture from its serving cost rather than from its benchmark scores.

**Adoption.** Kimi K2 uses MLA, and vLLM, SGLang, TensorRT-LLM, and FlashInfer carry dedicated MLA kernels for models with this cache layout.

### [YaRN](https://arxiv.org/abs/2309.00071) (2023)

*Efficient Context Window Extension of Large Language Models*

**Background.** RoPE encodes position as a rotation whose frequencies are set before training, so a model has only ever seen the rotations that occur inside its training length. Position interpolation had already shown that rescaling those frequencies and fine-tuning stretches the window.

**Problem.** Rescaling every frequency by the same factor squeezes the fast-rotating dimensions that carry short-range detail, so quality drops where it was previously fine, and recovering it takes a long fine-tuning run on long sequences.

**Key idea.** Extend a RoPE model's context window by interpolating the rotary frequencies unevenly, leaving the fast bands nearly untouched and stretching the slow ones, with a correction to the attention scale.

**Findings.** The paper reports reaching the target context with 10× fewer tokens and 2.5× fewer training steps than earlier extension methods.

**Why it matters.** Context length is usually bought after pretraining, which is why serving systems see windows the base model never trained on. The advertised window, the KV budget it implies, and the quality actually delivered at that depth are three separate questions, and this paper is where they come apart.

**Adoption.** Qwen 2.5 and DeepSeek-V3 ship YaRN as their long-context recipe, and it is a named rope\_scaling mode in Hugging Face Transformers, vLLM, and llama.cpp.

### [Gated DeltaNet](https://arxiv.org/abs/2412.06464) (2024)

*Gated Delta Networks: Improving Mamba2 with Delta Rule*

**Background.** Linear attention and state-space models replace the growing KV cache with a recurrent state of fixed size. Mamba2 controls that state with a decay gate; DeltaNet updates it with the delta rule, which overwrites the entry associated with the current key.

**Problem.** A bounded state has to do two opposed things: forget what is stale and write new associations precisely. Gating decays the whole state without regard to what it holds, and the delta rule targets one key while leaving everything else in place. Neither alone holds up on in-context retrieval.

**Key idea.** Put both in a single update, so each step decays the state and then edits the entry for the current key. The hybrid variants interleave these layers with sliding-window attention rather than replacing attention outright.

**Findings.** The combination beats Mamba2 and DeltaNet on in-context retrieval and long-context tasks.

**Why it matters.** This is the primitive the current hybrid stacks are built from. It also moves the question: the choice is not attention against recurrence but how a fixed-size state is managed, and the KV-cache meeting picks up the same idea from the serving side.

**Adoption.** Qwen3-Next interleaves Gated DeltaNet layers with gated attention, and flash-linear-attention, vLLM, and SGLang implement the operator for serving this hybrid.

## Sparse and alternative architectures

### [GShard](https://arxiv.org/abs/2006.16668) (2020)

*Scaling Giant Models with Conditional Computation and Automatic Sharding*

**Background.** In a dense transformer every parameter participates in every token, so the compute per token rises with the parameter count. A model too large for one accelerator also has to be split across many, and at the time that split was written by hand into the model code.

**Problem.** Two obstacles stand in the way of a much larger model: (1) dense scaling ties compute per token to total parameters, and (2) hand-partitioning a model over hundreds of accelerators is what makes giant models unbuildable in practice rather than merely expensive.

**Key idea.** Replace the feed-forward layer with a mixture of experts and route each token to two of them, so most parameters sit idle for any given token. Then annotate tensors with how they are sharded and let the compiler derive the partitioning and the communication it implies.

**Why it matters.** Read it for the idea the rest of this group depends on: total parameters and parameters used per token can be decoupled. It also names the bill that comes with the decoupling, since conditional computation turns a compute problem into a routing and communication problem.

**Adoption.** Top-2 token routing is used in Mixtral and in xAI's Grok-1.

### [Switch Transformer](https://arxiv.org/abs/2101.03961) (2021)

*Scaling to Trillion Parameter Models with Simple and Efficient Sparsity*

**Background.** GShard established the mixture-of-experts layer with each token routed to two experts. The reasoning was that a router only learns useful gradients when it has at least two experts to compare, so top-2 was treated as the floor.

**Problem.** Sending every token to two experts doubles both the expert compute and the all-to-all traffic that carries tokens to the devices holding those experts. Sparse models of the period were also reported as unstable to train, so cutting to one expert risked losing the model outright.

**Key idea.** Route each token to exactly one expert, and show the simplification holds. A load-balancing auxiliary loss keeps the router from concentrating on a few experts, and a capacity factor caps how many tokens any expert accepts, dropping the overflow.

**Why it matters.** The routing decision is data-dependent, which is what turns expert placement and load balancing into a serving problem. Top-1 is also the cheapest point on that curve, so it sets the baseline every later routing scheme has to beat on quality per unit of communication.

**Adoption.** The load-balancing auxiliary loss and capacity-factor token dropping are standard in the MoE layers of Megatron-LM and DeepSpeed-MoE, both of which also expose top-1 routing.

### [DeepSeekMoE](https://arxiv.org/abs/2401.06066) (2024)

*Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models*

**Background.** A conventional mixture-of-experts layer holds a modest number of large experts and routes each token to one or two of them, on the assumption that an expert will specialize if the router is trained to send it consistent work.

**Problem.** Coarse experts limit specialization from two directions. Each expert is large enough that it must cover several unrelated things at once, and the knowledge every token needs gets learned separately inside all of them, so capacity is spent on duplicates.

**Key idea.** Split each expert into finer-grained pieces and route to more of them, which gives the router many more combinations to choose from. Then set aside a few shared experts that every token passes through, so the common knowledge lives in one place and the routed experts are free to specialize.

**Why it matters.** This is the design the DeepSeek model line is built on, so it fixes the expert shape a serving stack has to place, balance, and keep resident. Many small experts per token means more all-to-all messages, each one smaller, which is a different network problem from top-1 routing.

### [DeepSeek-V3](https://arxiv.org/abs/2412.19437) (2024)

*Technical Report*

**Background.** An open-weight mixture-of-experts model at frontier scale, 671B total parameters with 37B activated per token, pretrained on 14.8T tokens for 2.788M H800 GPU hours. By 2024 the frontier labs had stopped publishing numbers of this kind.

**Problem.** Training a sparse model this large is where the failures live. Routing collapses onto a few experts, the auxiliary loss that prevents the collapse pulls against the language-modeling objective, and expert-parallel all-to-all traffic contends with compute for the same devices.

**Key idea.** Read the systems half. Auxiliary-loss-free load balancing steers the router with a per-expert bias instead of a gradient penalty, a multi-token prediction objective trains heads that predict further ahead than the next token, and FP8 carries most of the arithmetic. The report states what the run cost and how stable it was.

**Why it matters.** As a report it is the open counterexample to GPT-4, since training hours, precision decisions, and communication kernels are all stated. Its mechanisms also left the paper: the multi-token prediction heads became a speculative decoding path in vLLM and SGLang, and the kernels behind the run were released as DeepGEMM and DeepEP.

### [Mamba](https://arxiv.org/abs/2312.00752) (2023)

*Linear-Time Sequence Modeling with Selective State Spaces*

**Background.** Attention costs time quadratic in sequence length, and at decode time it costs a KV cache that grows with every token generated. Structured state-space models run in linear time with a state of fixed size, but their transitions did not depend on the input, so they could not do content-based recall.

**Problem.** A recurrence that ignores its input cannot decide what to keep, which is why state-space models lost to attention on language. Making the transitions input-dependent removes the convolutional form that the fast state-space algorithms relied on, so the fix destroys the speed.

**Key idea.** Make the state-space parameters functions of the input, then recover throughput with a hardware-aware parallel scan that keeps the recurrent state in SRAM instead of writing it to HBM. What the model carries forward is constant state per sequence rather than a growing KV cache.

**Why it matters.** Read it for what a serving stack would look like with no KV cache at all. There is nothing to page, nothing to evict, and no prefix to share across requests, so most of the memory machinery this course studies has no object to act on.

**Adoption.** Mamba blocks ship in Hugging Face Transformers and vLLM, and hybrid Mamba-attention stacks are the architecture of Jamba, Codestral Mamba, Falcon-Mamba, and NVIDIA's Nemotron-H.

### [MiniMax-01](https://arxiv.org/abs/2501.08313) (2025)

*Scaling Foundation Models with Lightning Attention*

**Background.** Sub-quadratic attention variants are usually demonstrated at a scale where the quadratic term was never the binding cost, which leaves open whether they survive a frontier-scale pretraining run.

**Problem.** A linear attention layer and a sparse mixture each change how work spreads across devices. The attention operator no longer carries a large dense matrix multiplication for communication to hide behind, and 32 experts add all-to-all traffic on top. Reaching a 1M-token context is a parallelism problem before it is a modeling one.

**Key idea.** Lightning attention, a linear attention computed in tiles so the recurrent state stays on chip, with full softmax attention kept in a fraction of the layers, combined with a 32-expert mixture. The result is 456B total parameters and 45.9B activated per token, trained at a 1M-token context and extrapolating to 4M at inference.

**Why it matters.** Read it for the parallelism and the computation-communication overlap the combination needs, which is what separates a sub-quadratic architecture demonstrated at 1B parameters from one shipped at frontier scale. The weights were released openly and MiniMax-M1 reuses the same lightning-attention hybrid; the team then reverted to full attention for M2.

### [DeepSeek-V4](https://arxiv.org/abs/2606.19348) (2026)

*Towards Highly Efficient Million-Token Context Intelligence*

**Background.** DeepSeek-V3.2 already served a long context with sparse attention, and vLLM and SGLang both added support for that attention when V3.2-Exp introduced it. The other parts assembled here exist elsewhere already: the Muon optimizer trained Kimi K2, and hyper-connections come from ByteDance's work.

**Problem.** At a one-million-token context the per-token cost of a forward pass and the size of the KV cache both grow past what a serving system can absorb, so reading a million tokens is priced out of ordinary use rather than unsupported.

**Key idea.** Release two preview models, one with 1.6T total parameters and 49B activated and one with 284B and 13B activated, both at a one-million-token context and pretrained on more than 32T tokens. Three changes carry the efficiency claim: compressed hybrid attention, manifold-constrained hyper-connections, and the Muon optimizer.

**Findings.** At a one-million-token context, the larger preview reports 27% of DeepSeek-V3.2's per-token inference FLOPs and 10% of its KV-cache footprint.

**Why it matters.** The headline comparison is a serving-cost ratio against the previous generation rather than a benchmark score. The report therefore connects its architecture choices directly to the cost of supporting the advertised context.

## The scaling-law argument

### [scaling laws](https://arxiv.org/abs/2001.08361) (2020)

*for Neural Language Models*

**Background.** By 2020 language models were plainly getting better as they got larger, but nobody could say in advance how much better a given increase in size, data, or compute would make them. Model sizes were justified after the run finished.

**Problem.** A pretraining run costs too much to treat as an experiment. Without a predictive relationship between resources and loss you cannot tell whether a larger model is worth its budget until you have already spent the budget.

**Key idea.** Test loss falls as a smooth power law in three quantities: parameters, dataset size, and training compute. The curves stay regular across several orders of magnitude, so a ladder of small runs extrapolates to a large one you have not trained.

**Why it matters.** This is the reason anyone believed making models bigger would keep working. It turns an open research question into a budgeting exercise, and every later argument about where to spend a fixed number of FLOPs inherits that framing.

### [Chinchilla](https://arxiv.org/abs/2203.15556) (2022)

*Training Compute-Optimal Large Language Models*

**Background.** The first scaling laws told labs to spend most of a growing compute budget on parameters, and the largest models that followed grew far faster than the token counts they were trained on.

**Problem.** If the split between model size and data is set wrong, a run buys less capability than its compute allows. The earlier fits were never checked against a sweep that varied both terms together at fixed compute.

**Key idea.** Refit the tradeoff with model size and token count both free instead of varying one term at a time.

**Findings.** The optimum moves: for a given compute budget the model should be much smaller and see far more data. Parameters and tokens scale together, roughly in step.

**Why it matters.** The correction is why 7B-class models are worth serving at all. A training-side result about where to spend FLOPs is what put a cheap-to-run model class within reach, since every request pays for parameters and not for training tokens.

### [Chinchilla replication](https://arxiv.org/abs/2404.10102) (2024)

*Chinchilla Scaling: A replication attempt*

**Background.** Chinchilla's sizing rule became the default for pretraining runs on the strength of a parametric fit, and its three estimation methods were reported as agreeing closely with one another.

**Problem.** A fit that every lab plans budgets from should survive being checked, but a headline exponent published without honest uncertainty gives a reader no way to see how much of the claim the underlying data actually supports.

**Key idea.** Refit Chinchilla's own reported data and reconstruct uncertainty for each of its three estimation methods.

**Findings.** The headline parametric estimate is inconsistent with the reported data, its confidence intervals are far too tight to be credible, and the three estimation methods do not agree as well as claimed.

**Why it matters.** The roughly-20-tokens-per-parameter ratio broadly survives; the stated precision does not. Read it straight after Chinchilla, as an exercise in how much of a scaling claim is left once someone checks it.

### [over-training](https://arxiv.org/abs/2403.08540) (2024)

*Language models scale reliably with over-training and on downstream tasks*

**Background.** Chinchilla's optimum minimizes loss for a fixed training budget and says nothing about what happens after the run ends. Its fits also predict pretraining loss rather than error on the downstream tasks anyone deploys a model for.

**Problem.** A model you intend to serve for a long time should be small, because every request pays for its parameters. That argues for training well past the compute-optimal token budget, and nobody had shown the scaling relationships still hold out there.

**Key idea.** Deliberately push models far past the Chinchilla token budget and fit the curves again.

**Findings.** Loss stays predictable in the over-trained regime, and downstream task error stays predictable as a function of loss.

**Why it matters.** This is why nobody actually trains compute-optimal. It connects the training-side scaling argument to the inference bill this course is about: you spend more once, at training time, precisely to lower the cost of every request afterwards.

### [data limits](https://arxiv.org/abs/2211.04325) (2022)

*Will we run out of data? Limits of LLM scaling based on human-generated data*

**Background.** The scaling laws treat data as one of three terms you buy, and Chinchilla's correction told labs to buy much more of it. Compute and parameters can be bought with money; text has to already exist.

**Problem.** The stock of public human-written text is finite and does not grow with a training budget. If that term runs dry, the recipe that made models better stops being executable at the same time as compute keeps getting cheaper.

**Key idea.** Estimate the stock of public human-written text and project it against the token appetite of successive pretraining runs, which yields a date range at which scaling the data term stops being an option.

**Why it matters.** One of the three terms has a floor and the other two do not. That asymmetry is part of why the argument moved to post-training and to compute per forward pass, which is where this course picks it up.

### [scaling laws for precision](https://arxiv.org/abs/2411.04330) (2024)

*Scaling Laws for Precision*

**Background.** Scaling laws count parameters, tokens, and compute, and treat numeric precision as a fixed implementation detail. Quantization was studied separately, as something you do to a model after training has finished.

**Problem.** Precision is not independent of the rest of the recipe, so treating it as a detail leaves two coupled questions unanswerable: what precision to train at, and how much accuracy a given model will lose when you quantize it later.

**Key idea.** Add bits per weight to the scaling law and fit the interaction between the terms. They do not separate: the more tokens a model saw, the more post-training quantization costs it, so the compute-optimal training precision is not 16 bits.

**Why it matters.** It makes precision a budget variable rather than a deployment afterthought, and it says a heavily trained model is harder to compress. Read it now for the shape of the claim and again before the quantization meeting, which is the systems half of the same question.

### [test-time compute](https://arxiv.org/abs/2408.03314) (2024)

*Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters*

**Background.** Every scaling result up to this point spends compute at training time and treats generation as a fixed cost per token. For a harder problem, the only lever was a larger model.

**Problem.** A bigger model is expensive once and then expensive forever, because every request pays for the extra parameters. It is also the wrong lever when difficulty is concentrated in a few hard queries rather than spread evenly across the workload.

**Key idea.** Spend the compute at generation time instead, searching against a verifier or revising an answer in sequence, and allocate it per prompt according to how hard that prompt is. On some problem distributions that beats spending the same compute on a bigger model.

**Why it matters.** The axis moves to inference, and that trade is the premise of the whole course. It converts a training-budget question into a serving-system question, and every optimization in Part II is about making the inference side of it cheap.

### [observational scaling laws](https://arxiv.org/abs/2405.10938) (2024)

*Observational Scaling Laws and the Predictability of Language Model Performance*

**Background.** A scaling law is normally fitted by training a ladder of models yourself: one family, one recipe, one set of hyperparameters held fixed while size or data varies.

**Problem.** That ladder costs a pretraining budget most groups do not have, and the fit describes only the family you trained. Public checkpoints cannot simply be pooled instead, because they differ in architecture, data, and recipe, so their compute numbers are not comparable.

**Key idea.** Place existing public models in a low-dimensional capability space recovered from their benchmark scores, then fit the scaling relationship in that space. Heterogeneous released checkpoints stand in for a ladder you would otherwise have to train.

**Why it matters.** It puts a scaling claim within reach on a budget, which is the situation you will be in for the final project. It also separates the question of what scales from the question of who can afford to measure it.

### [ScaleRL](https://arxiv.org/abs/2510.13786) (2025)

*The Art of Scaling Reinforcement Learning Compute for LLMs*

**Background.** Pretraining has predictive scaling: fit a curve on small runs and you know roughly what a large one buys. Reinforcement learning had no such curve, and RL is now where a large share of the compute goes.

**Problem.** Without a curve, a recipe can only be judged at the scale it was run at, so you cannot tell whether one recipe beats another or is merely further along the same trajectory.

**Key idea.** More than 400,000 GPU-hours of controlled runs show that compute-performance curves for RL are sigmoidal rather than power laws, and that recipes differ in their asymptote. Loss aggregation, normalization, curriculum, and the off-policy algorithm mostly move compute efficiency without shifting that asymptote. The best-practice recipe extrapolates from small runs to a single 100,000 GPU-hour run.

**Why it matters.** If the recipe sets the ceiling and the other choices only set how fast you reach it, a small-scale win means less than it appears. Read it against the post below, which argues post-training is the dial with slack left in it; this is the first serious attempt to make that dial predictable.

### [Scaling laws carefully](https://lilianweng.github.io/posts/2026-06-24-scaling-laws/) (2026)

*Scaling Laws, Carefully (Lilian Weng)*

**Background.** Kaplan and Chinchilla are the two fits a pretraining budget gets planned from, and they disagree about how to split a compute budget between parameters and tokens, 5.5× the model for 10× the compute against doubling both together.

**Problem.** The disagreement is not about the phenomenon but about the fit. It rests partly on whether embedding parameters are counted and partly on a fitting procedure that stopped early and was reported to two decimal places. A law fit that way can be wrong in the direction you plan by.

**Key idea.** The methodological rules are the part to keep. Hold architecture, optimizer, learning-rate schedule, and data mix fixed across every rung of the ladder, fit with more than one method rather than trusting a single parametric fit, and treat extrapolation with suspicion, because a small error at the small end compounds in log-log space. When unique data runs short, the value of a token decays with each epoch it is reused, so the repeated-data case needs its own term.

**Why it matters.** The corrections it collects, the Chinchilla replication of Besiroglu et al. and the data-constrained laws of Muennighoff et al., are where a pretraining ladder gets its fitting recipe today. Read it before you fit a scaling law of your own for the final project.

### [thoughts about scaling law](https://x.com/jietang/status/2089941544581403107) (2026)

*Jie Tang (Z.ai), on X*

**Background.** A model is announced with a parameter count, and the fits above turn a compute budget into parameters and tokens. This post is the argument as practitioners are having it now, and the hypothesis the papers above are worth checking against.

**Problem.** A parameter count means nothing on its own. It has to be read alongside how much data there was, where the compute goes per forward pass, and who will run the model under what conditions.

**Key idea.** Total parameters matter up to roughly “enough to hold the world,” and the dial with slack left in it is post-training. GLM-5.3 is offered as the controlled test, same base and same activated and total parameters as 5.2, one extra month of long-horizon RL.

**Why it matters.** Note where that lands the bill. If capability now comes from post-training and from compute spent per forward pass, it lands on the serving system. The same post-training-first bet drives the DeepSeek-R1 and Qwen3 releases, where the gains come from added RL stages rather than a larger base model.

## Data

### [The Pile](https://arxiv.org/abs/2101.00027) (2020)

*An 800GB Dataset of Diverse Text for Language Modeling*

**Background.** Training a language model at GPT-3 scale needs hundreds of gigabytes of text, and in 2020 the corpora that supplied it sat inside a few labs. What was public was a bulk web crawl.

**Problem.** A bulk crawl gives you one distribution and no control over what is in it. Nothing public let you say what a model had read, and nothing let a claim about a data mix be compared against a stated alternative.

**Key idea.** Assemble 825 GiB from 22 sources chosen for diversity rather than scraped in bulk, and document each component separately, so the composition of the corpus is part of the release.

**Why it matters.** It made composition a design variable you can state rather than a property of whatever the crawler returned. It is also the first widely used open pretraining corpus and the baseline the later ones are argued against, so a data-mix claim has something concrete to be a claim about.

**Adoption.** Cerebras-GPT used The Pile as its training corpus, demonstrating uptake outside the team that assembled the dataset.

### [C4 analysis](https://arxiv.org/abs/2104.08758) (2021)

*Documenting Large Webtext Corpora: A Case Study on the Colossal Clean Crawled Corpus*

**Background.** C4 is the filtered Common Crawl snapshot released with T5, and it became a default pretraining corpus. Like most corpora of its size, it shipped with its filters described and its contents unexamined.

**Problem.** Describing a filter does not tell you what survived it. One snapshot turns out to hold machine-generated text and evaluation examples from other benchmarks, and its blocklist filtering removes text about minority groups at a disproportionate rate.

**Key idea.** Audit the artifact rather than the pipeline: where the documents came from, what the filters let through, and who the exclusion lists exclude. The argument is for documenting a corpus rather than describing the filters that produced it.

**Why it matters.** Two things you carry into every evaluation afterwards. Benchmark contamination is a property of the training set rather than of the benchmark, and a filter written to remove offensive text also removes speakers. Neither is visible from the filter list.

### [DataComp-LM](https://arxiv.org/abs/2406.11794) (2024)

*In search of the next generation of training sets for language models*

**Background.** Curation decisions, which sources, which filters, which deduplication, are reported as choices a lab made, each one bundled with a different model, tokenizer, and compute budget.

**Problem.** Corpora compared that way cannot be compared. If the recipe moves with the data, a better score can come from either of them, so curation stays a matter of taste rather than a measurable result.

**Key idea.** Hold the training recipe fixed and vary only the data, which turns curation into a controlled experiment. Fixed model scales and a fixed evaluation suite make a data mix something you submit and others can rerun.

**Why it matters.** It gives the data half of the scaling argument the experimental discipline the model half already had. Afterwards you can ask which filtering step earned its place, instead of taking a corpus as an indivisible artifact.

**Adoption.** OLMo 2 and SmolLM2 use DCLM-Baseline in their pretraining data mixtures.

### [OLMo](https://arxiv.org/abs/2402.00838) (2024)

*Accelerating the Science of Language Models*

**Background.** By 2024 open weights were normal and the rest of the pipeline was not. A released model usually arrived without its training data, without the order that data was seen in, and without the code that produced it.

**Problem.** Weights let you study the model that exists, not the process that made it. Questions about a training decision, what a data mix contributed or when a capability appeared, cannot be answered from a final checkpoint.

**Key idea.** Release weights, training data, training code, and evaluation code together as one artifact. The whole pipeline becomes inspectable and re-runnable rather than only its endpoint.

**Why it matters.** It reframes openness as a property of the pipeline rather than of the weights. This is the family to pick when a project needs to see inside training rather than around it, because reproduction becomes a question of compute rather than of access.

### [Pythia](https://arxiv.org/abs/2304.01373) (2023)

*A Suite for Analyzing Large Language Models Across Training and Scaling*

**Background.** Claims about training dynamics, when a capability appears and what a model memorizes, are made about models whose intermediate states were never released and whose data order differed from one size to the next.

**Problem.** Comparing two released models confounds scale with data, order, and recipe, and comparing a final checkpoint with itself says nothing about the trajectory that produced it. There is no controlled setting to measure in.

**Key idea.** 16 models from 70M to 12B parameters, trained on the same data in the same order, with 154 checkpoints kept per model. Scale and training time become the only two variables that move.

**Why it matters.** It is the one public setup where a claim about training dynamics can be checked rather than asserted. With the data order fixed and published, you can ask when a behavior appeared and what the model had seen by then, which is a question about the run rather than about the endpoint.

### [FineWeb](https://arxiv.org/abs/2406.17557) (2024)

*Decanting the Web for the Finest Text Data at Scale*

**Background.** Every open pretraining corpus by 2024 was a Common Crawl derivative, and each one described its filtering as a list of heuristics whose effect on downstream accuracy was asserted rather than measured.

**Problem.** You cannot tell which filtering step earned its place. Deduplication, quality classifiers, and URL blocklists interact, so a corpus that scores well gives you no guidance about which decision to keep when you build the next one.

**Key idea.** 15T tokens from 96 Common Crawl snapshots, with every deduplication and filtering decision ablated rather than asserted. The same method applied to an educational-quality classifier produces FineWeb-Edu, a 1.3T-token subset that moves knowledge and reasoning benchmarks noticeably.

**Why it matters.** Curation becomes an experiment with a measured effect size instead of folklore. It also gives you the open corpus most models after 2024 are either trained on or compared against, which is what makes their reported numbers comparable at all.

### [Nemotron-CC](https://arxiv.org/abs/2412.02595) (2024)

*Transforming Common Crawl into a Refined Long-Horizon Pretraining Dataset*

**Background.** Model-based quality classifiers became the standard way to filter web text, and the aggressive settings that produce the best benchmark results discard most of what a crawl contains.

**Problem.** Aggressive model-based filtering removes about 90% of the data, which becomes a problem once the plan is to train for 15T tokens. The unique tokens that survive run out, and the run repeats epochs instead of seeing new text.

**Key idea.** Ensemble several classifiers rather than trusting one, rephrase low-quality documents synthetically instead of dropping them, and use fewer heuristic filters.

**Findings.** The full 6.3T-token set matches DCLM on MMLU with four times more unique real tokens. An 8B model trained for 15T tokens beats Llama 3.1 8B by 5 points on MMLU.

**Why it matters.** This is the data-side statement of the over-training argument above. A long token budget changes what filtering should optimize for, from quality per document to unique tokens retained.

### [Common Pile](https://arxiv.org/abs/2506.05209) (2025)

*The Common Pile v0.1: An 8TB Dataset of Public Domain and Openly Licensed Text*

**Background.** The Pile and the web-scale corpora after it made open pretraining possible by collecting text whose licensing was never settled, and the models trained on them inherit that exposure.

**Problem.** A corpus you cannot license is a corpus you cannot ship. The standard objection to license-clean text is that there is not enough of it to train a model anyone would use.

**Key idea.** Assemble eight terabytes from 30 openly licensed sources, then train two 7B models on the corpus to test whether the licensing constraint still permits competitive pretraining.

**Findings.** Models trained for 1T and 2T tokens perform near Llama 1 and Llama 2 7B at comparable training compute.

**Why it matters.** Licensing is not a systems question, and the answer to it still decides what a course project is permitted to train on. The paired training runs also bound what the constraint costs you against named baselines at matched compute, instead of leaving it as an argument.

### [Olmo 3](https://arxiv.org/abs/2512.13961) (2025)

*Olmo 3*

**Background.** Fully open releases, OLMo and Pythia among them, publish weights alongside pretraining data and code so you can look inside the pretraining run. Post-training stayed opaque even in those releases.

**Problem.** A checkpoint tells you where a model ended up, not how it got there. Without the intermediate stages and the data behind each one, you cannot attribute a behavior to pretraining, to supervised fine-tuning, or to reinforcement learning.

**Key idea.** 7B and 32B models released as a flow rather than a checkpoint: every stage, checkpoint, data point, and dependency in the lifecycle, including the strongest fully open thinking model at release.

**Why it matters.** Where OLMo and Pythia above let you look inside pretraining, this extends the same access to the post-training stages described in the next group. It is what you reach for when a project needs to intervene at one stage rather than fine-tune the finished model.

## Post-training

### [FLAN](https://arxiv.org/abs/2109.01652) (2021)

*Finetuned Language Models Are Zero-Shot Learners*

**Background.** GPT-3 showed that a large pretrained model can be steered by a prompt, and getting a useful answer meant hunting for a phrasing and a set of in-context examples that happened to work.

**Problem.** Zero-shot accuracy trailed few-shot badly, which suggests the model was pattern-matching the examples rather than reading the task description. Nothing in next-token pretraining teaches a model that an instruction is a request to be carried out.

**Key idea.** Instruction tuning in its first clear form: fine-tune a 137B model on over 60 tasks phrased as instructions, then evaluate on held-out task types.

**Findings.** Zero-shot accuracy improves, beating zero-shot 175B GPT-3 on 20 of the 25 tasks evaluated.

**Why it matters.** This is where the prompt stops being a trick and becomes the interface. Following instructions turns into a training objective you can budget for, which is what makes an API that accepts plain requests something you can build a system against.

### [T0](https://arxiv.org/abs/2110.08207) (2021)

*Multitask Prompted Training Enables Zero-Shot Task Generalization*

**Background.** FLAN established that fine-tuning on many tasks phrased as instructions improves zero-shot generalization, using a 137B decoder-only model and a small number of phrasings per task.

**Problem.** A model tuned on one wording per task can learn the wording instead of the task, and it stays unclear how much of the reported gain comes from parameter count as opposed to the training format.

**Key idea.** Express each training task through several prompt templates and fine-tune an encoder-decoder model across the resulting task-prompt combinations. The variation is intended to teach the task rather than one favored wording.

**Findings.** T0 often beats zero-shot systems up to 16× its size on held-out tasks while using no examples from those task types during training.

**Why it matters.** Read it with FLAN for how much of what looks like capability is training format rather than parameters. Sensitivity to wording becomes a property you can measure and reduce, which sets an expectation for how far a rephrased prompt should move a result.

### [InstructGPT](https://arxiv.org/abs/2203.02155) (2022)

*Training language models to follow instructions with human feedback*

**Background.** Instruction tuning on curated task collections makes a model follow instructions, and the tasks people actually type are open-ended requests that no existing dataset supplies answers for.

**Problem.** Most requests have no single correct output to supervise, and the property people care about, whether the answer is helpful and harmless, is far easier to judge by comparing two completions than to write down as a loss.

**Key idea.** The RLHF pipeline, stated plainly. Supervised fine-tuning, a reward model trained on human comparisons, then policy optimization against it, with a penalty that keeps the policy near the supervised model.

**Why it matters.** It converts a preference into an objective you can optimize, and it puts three distinct training jobs and a sampler into one pipeline. Much of the systems difficulty in later alignment work follows from that structure rather than from the algorithm.

**Adoption.** Hugging Face TRL, DeepSpeed-Chat, OpenRLHF, and verl implement the supervised, reward-model, and policy-optimization stages as reusable training pipelines.

### [Constitutional AI](https://arxiv.org/abs/2212.08073) (2022)

*Harmlessness from AI Feedback*

**Background.** RLHF learns harmlessness from human comparison labels, which means people read and rank model outputs, including the outputs the model should have refused to produce.

**Problem.** That labeling scales badly and cannot be audited. The standard the annotators applied lives in their heads and in a guideline document, so the policy the model absorbed is neither inspectable nor revisable after the fact.

**Key idea.** Replaces human harmlessness labels with a written list of principles and a model that critiques and revises its own outputs. The revisions become supervised training data, and a preference model trained on the model's own comparisons stands in for the human labelers.

**Why it matters.** The policy becomes a document you can read and edit. Therefore the training job now consumes generated tokens in bulk, which puts a sampler inside the training loop and makes alignment compete with serving for inference capacity.

**Adoption.** Hugging Face publishes an external constitutional-AI training recipe that implements critique, revision, and preference generation from a written constitution.

### [DPO](https://arxiv.org/abs/2305.18290) (2023)

*Direct Preference Optimization: Your Language Model is Secretly a Reward Model*

**Background.** Preference alignment at the time ran in two stages. A reward model is fit to human preference pairs, then PPO optimizes the policy against that reward while a KL penalty holds it near a frozen reference model.

**Problem.** The second stage is the expensive one. It keeps a reward model and a value network resident alongside the policy and the reference, and it generates samples inside every update step, which makes the run both memory-hungry and sensitive to hyperparameters.

**Key idea.** The KL-constrained objective has a closed-form optimal policy, so the reward can be rewritten in terms of the policy and reference log probabilities. Preference training collapses into a classification loss over pairs, removing the reward model and the RL loop entirely.

**Why it matters.** It is a large systems simplification. Alignment becomes an ordinary supervised training job with a frozen second copy of the model, no sampler and no critic. It also sets up the question later work reopens, which is what the RL loop was buying.

**Adoption.** Hugging Face TRL ships a DPOTrainer, and Axolotl and Unsloth wrap it. Llama 3 and Zephyr both used DPO for preference alignment in place of PPO.

### [GRPO](https://arxiv.org/abs/2402.03300) (2024)

*DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models*

**Background.** PPO-style RLHF trains a value network beside the policy to turn one end-of-sequence reward into per-token advantages. The critic is a second trained network, updated online with the policy.

**Problem.** On tasks where the reward arrives once, at the end, that critic is expensive machinery for a small amount of information, and it occupies memory and optimizer state the policy could use.

**Key idea.** Read it for §4 rather than for the math scores. Group relative policy optimization samples a group of answers to the same prompt and normalizes their rewards against each other, which removes the value network that PPO needs.

**Why it matters.** Nearly every RL pipeline since is a sampler feeding an update, and dropping the critic is as much a memory decision as an algorithmic one. What the loop spends is generation rather than extra trained parameters.

**Adoption.** Hugging Face TRL ships a GRPOTrainer, and verl and Unsloth provide independent implementations of the update.

### [Tulu 3](https://arxiv.org/abs/2411.15124) (2024)

*Pushing Frontiers in Open Language Model Post-Training*

**Background.** Frontier post-training is described in model reports at the level of stage names. You learn that a model was fine-tuned, preference-tuned, and reinforcement-learned, without the mixtures, the filtering, or the order.

**Problem.** A recipe you cannot see is a recipe you cannot debug. When a stage helps, you cannot tell whether the gain came from the objective, from the data mixture, or from contamination between training and evaluation.

**Key idea.** The whole post-training pipeline written out: supervised fine-tuning, direct preference optimization, reinforcement learning with verifiable rewards, the data, the decontamination work, and a section on the methods that did not reliably help.

**Why it matters.** It is the counterpart to a closed report that summarizes all of this in one paragraph. Reading the negative results tells you which stages are worth the compute, which is the decision a post-training budget actually turns on.

## Reasoning

### [chain-of-thought](https://arxiv.org/abs/2201.11903) (2022)

*Prompting Elicits Reasoning in Large Language Models*

**Background.** Few-shot prompting gave the model input-output pairs and read the answer off the next token. Growing the model raised accuracy on many tasks and left multi-step arithmetic and symbolic problems close to flat.

**Problem.** A prompt whose examples jump straight to the answer gives the model nowhere to put intermediate work, so a question that needs several dependent steps has to be settled inside one forward pass.

**Key idea.** Write the worked steps into the few-shot examples. Ask for the intermediate steps and accuracy on multi-step problems rises, with no change to the model or to the training.

**Why it matters.** The cost is paid in decode tokens, which is the first time a prompting technique visibly moves the serving bill. Accuracy becomes something you buy with generation length, and later test-time scaling work is that trade made explicit.

**Adoption.** LangChain and LangGraph expose step-by-step prompting patterns directly in their agent and reasoning workflows.

### [self-consistency](https://arxiv.org/abs/2203.11171) (2022)

*Improves Chain of Thought Reasoning in Language Models*

**Background.** Chain-of-thought prompting decodes one path and takes the answer at its end, so the trace and the answer are a single draw from the model.

**Problem.** One wrong step ends the chain at a wrong answer, and nothing in the trace tells you it happened. Greedy decoding also discards the other derivations the model would have produced.

**Key idea.** Sample several reasoning paths and take the majority answer. Different derivations that agree on a final answer are evidence for it, so the vote turns the diversity of temperature sampling into accuracy.

**Findings.** With PaLM-540B, self-consistency improves chain-of-thought accuracy by 17.9 percentage points on GSM8K, 11.0 on SVAMP, 12.2 on AQuA, 6.4 on StrategyQA, and 3.9 on ARC-Challenge.

**Why it matters.** One request becomes many independent decodes over a shared prompt, which is the workload shape that makes prefix reuse and batching worth the engineering. It also prices accuracy directly in samples.

### [STaR](https://arxiv.org/abs/2203.14465) (2022)

*Bootstrapping Reasoning With Reasoning*

**Background.** Prompting elicits reasoning traces at inference time, and fine-tuning on written-out rationales produces a model that reasons by default. The second path needs a rationale dataset to fine-tune on.

**Problem.** Rationales are the scarce supervision. Final answers are cheap and plentiful, and hand-writing a step-by-step derivation for every training example is not something you can scale.

**Key idea.** Generate rationales, keep those that reach the correct answer, fine-tune on them, and repeat. The answer key filters generated supervision without requiring people to write each derivation.

**Findings.** On CommonsenseQA, the iterative procedure performs comparably to fine-tuning a model 30× larger on the same task.

**Why it matters.** Reasoning becomes something you train for rather than something you prompt for, and the answer key becomes the filter that replaces human labels. The training job now contains a generation phase, so it needs an inference server inside it.

### [DeepSeek-R1](https://arxiv.org/abs/2501.12948) (2025)

*Incentivizing Reasoning Capability in LLMs via Reinforcement Learning*

**Background.** Long reasoning traces had been obtained by prompting for them or by fine-tuning on a curated set of rationales. Both routes require someone to produce the rationales first.

**Problem.** That supervision does not scale, and it fixes the shape of the reasoning. The model learns the traces you managed to collect rather than whatever chain would actually solve the problem.

**Key idea.** Reinforcement learning against checkable answers elicits long reasoning traces without a supervised rationale dataset. The report also gives the distillation path, training smaller dense models on the traces the large model produces.

**Why it matters.** Read it for the recipe and for the workload it produces. A reasoning model emits far more decode tokens per request, which shifts every tradeoff in Part II toward the decode side.

### [Qwen3](https://arxiv.org/abs/2505.09388) (2025)

*Qwen3 Technical Report*

**Background.** By 2025 a reasoning model and a fast conversational model were usually separate weights, and the length of a reasoning trace was a property of the checkpoint you loaded rather than something the caller could ask for.

**Problem.** Two deployments cost twice as much to serve, and neither lets a caller who has an easy question say so. The reasoning length is fixed by the model, so accuracy and latency cannot be traded per request.

**Key idea.** One model carries both thinking and non-thinking modes, and the caller sets the thinking budget per request. The report also lays out a dense and mixture-of-experts ladder from 0.6B to 235B parameters under one recipe, which is what makes the family convenient when a project needs to sweep model size.

**Why it matters.** Read it as an interface question: the client is now allowed to buy accuracy with latency, and the serving system has to admit and schedule requests whose length is chosen at call time. Caller-set thinking budgets now appear in the Anthropic and Gemini APIs.

### [s1](https://arxiv.org/abs/2501.19393) (2025)

*Simple test-time scaling*

**Background.** Reasoning models answer better when they think longer, and the recipes that produced that behavior arrived through large reinforcement-learning runs over large datasets.

**Problem.** Those recipes leave the thinking length to the model. Nothing in them separates what more training bought from what more thinking bought, and a deployment has no handle to spend on thinking directly.

**Key idea.** Fine-tune on 1,000 curated questions, then control length at decode time with budget forcing, which cuts the thinking process off or extends it by appending "Wait" when the model tries to stop.

**Findings.** Budget forcing alone takes AIME24 from 50% to 57% on the same weights.

**Why it matters.** It is the cheapest demonstration that the thinking budget is a knob, and that the serving system is what holds it. Accuracy becomes something a scheduler can trade against latency without touching the weights.

### [test-time scaling in the wild](https://arxiv.org/abs/2608.18931) (2026)

*Why Exploitation, Not Exploration, Is the Bottleneck*

**Background.** Test-time scaling spends more compute per request by drawing more candidates. The results that justify it come mostly from math and code, where a verifier can check whether a candidate answer is right.

**Problem.** Open-ended tasks have no verifier, so a reward model has to pick the winner out of the pool. If that selection step is weak, extra samples buy nothing no matter how much the pool improves.

**Key idea.** Compare five test-time-scaling families across five open-ended domains while normalizing the compute budget.

**Findings.** Exploration scales and exploitation does not: the best candidate in the pool keeps improving with compute, while reward models correlate at about 0.12 with true quality, so selection is close to random at any budget. Only synthesis across candidates beats a single sample, recovering about 40% of the quality available in the pool.

**Why it matters.** Read it with the entry above before spending a serving budget on extra samples. Additional decoding is useful only when the system can exploit the candidates it produces.

## Evaluation

### [MMLU](https://arxiv.org/abs/2009.03300) (2020)

*Measuring Massive Multitask Language Understanding*

**Background.** Language model evaluation in 2020 ran on suites built around one skill at a time, such as entailment between two sentences or question answering over a supplied passage.

**Problem.** None of those suites measures breadth of knowledge, so a high score leaves open whether the model learned a task format or learned a subject. A model that cannot be asked about law or medicine cannot be compared on them either.

**Key idea.** Build one multiple-choice test spanning 57 subjects, from elementary mathematics to professional law, and report one aggregate accuracy.

**Why it matters.** It became the benchmark most scaling claims are still plotted against, which makes it the case to study for what a single aggregate number over 57 unequal tasks can and cannot support. The average hides which subjects moved.

### [HELM](https://arxiv.org/abs/2211.09110) (2022)

*Holistic Evaluation of Language Models*

**Background.** By 2022 a model's reported numbers came from whichever benchmarks its authors picked, run under whichever prompt format and decoding settings they picked.

**Problem.** Nothing made two models comparable. A gap between two reported scores could come from the models or from the harness, and a reader had no way to tell which tasks a model had quietly skipped.

**Key idea.** Treat evaluation as a design space. HELM fixes seven metrics over 16 core scenarios and applies them to 30 models under standardized conditions.

**Findings.** The standardized matrix makes coverage explicit: models had previously been evaluated on 17.9% of those core scenarios on average, versus 96.0% under HELM.

**Why it matters.** Efficiency is one of the seven metrics, which is unusual and worth noticing, because it puts cost and latency on the same scorecard as accuracy instead of in a separate paper. Missing coverage becomes visible rather than something the reader has to detect.

### [emergent abilities](https://arxiv.org/abs/2206.07682) (2022)

*of Large Language Models*

**Background.** Scaling laws describe loss falling smoothly as parameters, data, and compute grow, and that smooth curve is what training budgets are planned against.

**Problem.** Loss is not the quantity anyone deploys. A smooth loss curve says nothing about when a model will be able to do a particular task, and accuracy on some tasks sits at chance across several orders of magnitude of scale before it moves.

**Key idea.** The paper collects those cases and names them emergent abilities: capabilities absent in smaller models and present in larger ones, appearing discontinuously with scale rather than improving gradually.

**Why it matters.** It is a good exercise in asking whether an effect is real or an artifact of the metric. If abilities do arrive as steps, then no amount of small-scale measurement tells you what the next training run will be able to do.

### [emergence, a mirage?](https://arxiv.org/abs/2304.15004) (2023)

*Are Emergent Abilities of Large Language Models a Mirage?*

**Background.** The emergent-abilities claim, listed above, reads sharp jumps in downstream accuracy as capabilities that appear only past a scale threshold, and those jumps are usually plotted with exact-match accuracy on multi-step answers.

**Problem.** Exact-match scoring on a multi-step answer is discontinuous by construction. A model that is steadily getting closer scores zero until every step is right, so the metric can produce the jump without the model doing anything abrupt.

**Key idea.** Swap the discontinuous metric for a continuous one and several famous jumps disappear, leaving a smooth underlying curve. The same measurements support both pictures, depending only on how they are scored.

**Why it matters.** The transferable lesson is about measurement, not about emergence. The same mistake is available to anyone plotting a latency threshold: a pass or fail cutoff applied to a continuously improving quantity will show you a cliff the system does not have.

### [Chatbot Arena](https://arxiv.org/abs/2403.04132) (2024)

*An Open Platform for Evaluating LLMs by Human Preference*

**Background.** A static benchmark scores a fixed set of questions against a fixed answer key. That works for multiple choice and not for open-ended chat, where the thing being judged is whether a person prefers one response to another.

**Problem.** Preference has no answer key. Paid annotators are expensive and the prompts they write are not the prompts real users send, and a ranking assembled from sparse pairwise votes has to say how much of the ordering the votes actually support.

**Key idea.** Serve two anonymous models side by side to real users, take the pairwise vote, and fit a preference model that turns those comparisons into one ranking. The paper reports over 240K votes at the time of writing.

**Why it matters.** It is the leaderboard everyone cites, and the one whose statistics you should understand before citing it. Votes arrive on prompts the voters chose, so the ranking measures preference on that traffic rather than capability in general.

### [benchmark contamination](https://arxiv.org/abs/2406.04244) (2024)

*Benchmark Data Contamination of Large Language Models: A Survey*

**Background.** Benchmarks are published on the web, and pretraining corpora are scraped from the web. The C4 analysis listed above already found benchmark examples sitting inside a pretraining corpus, so the overlap is documented rather than hypothetical.

**Problem.** When the test set is in the training corpus, a score stops measuring generalization and starts measuring recall, and the number alone will not tell you which. No closed model publishes its training corpus, so the overlap cannot simply be looked up.

**Key idea.** The survey collects what contamination is, how it enters a corpus, and the detection methods that have been proposed for it, both the ones that inspect the corpus directly and the ones that probe the model when the corpus is unavailable.

**Why it matters.** Every capability claim in this course rests on a benchmark number, and contamination is the failure mode that voids one silently. Decontamination is now a routine pretraining step, the Llama 3 and Qwen reports both publish contamination analyses, and refreshed benchmarks such as LiveBench and LiveCodeBench exist to sidestep it.

### [LongBench](https://arxiv.org/abs/2308.14508) (2023)

*A Bilingual, Multitask Benchmark for Long Context Understanding*

**Background.** By 2023 model releases advertised context windows in the tens of thousands of tokens, and the evidence offered was usually a single retrieval probe planted in a long filler document.

**Problem.** A long window is a claim about capacity, not about use. Nothing in the advertised number tells you whether the model can answer a question that requires reading the whole input, and a retrieval probe can be passed without using any of the rest of it.

**Key idea.** Combine 21 datasets across 6 task categories in English and Chinese, averaging 6,711 words for the English tasks. Real documents make the evaluation exercise the long context window rather than merely advertise one.

**Why it matters.** It is the measurement half of every long-context and KV-cache argument in Part II. A compression scheme that drops most of the cache and holds accuracy on LongBench is making a claim you can check; SnapKV and KIVI both report on it, which is what makes those numbers comparable.

### [MMLU-Pro](https://arxiv.org/abs/2406.01574) (2024)

*A More Robust and Challenging Multi-Task Language Understanding Benchmark*

**Background.** MMLU, listed above, is the 57-subject multiple-choice test most scaling claims are still plotted against. By 2024 strong models scored high enough on it that the remaining headroom was small and the ranking between them turned on a few points.

**Problem.** Part of what MMLU measures is the harness rather than the model. Four options leave a large share of the score reachable by guessing, some questions are noisy or trivial, and a score that moves with prompt wording is not a property of the model at all.

**Key idea.** Take MMLU, remove the trivial and noisy questions, and raise the number of answer options from four to ten.

**Findings.** Accuracy falls 16-33% against MMLU, and sensitivity to prompt wording drops from 4-5% to 2% across 24 prompt styles.

**Why it matters.** Read it next to MMLU for how much of a benchmark number belongs to the harness rather than to the model; the Open LLM Leaderboard v2 answered by running MMLU-Pro in place of MMLU. The same question applies to every throughput figure later in the course.

### [RULER](https://arxiv.org/abs/2404.06654) (2024)

*What's the Real Context Size of Your Long-Context Language Models?*

**Background.** The standard long-context test was needle-in-a-haystack: hide one sentence in a long filler document and ask the model to retrieve it. Models pass it at the full advertised window, and that pass is what gets quoted as the context size.

**Problem.** Retrieving one distinctive sentence is the easiest thing a long input can ask for. It says nothing about holding several facts at once, following a chain of references through the document, or aggregating over all of it, so the advertised window and the usable one come apart.

**Key idea.** Generalize the needle test into multiple needles, multi-hop tracing, and aggregation, at configurable lengths, so the same task can be rerun as the input grows. All 17 models evaluated claim a context of 32K tokens or more, and only about half still perform acceptably at that length.

**Why it matters.** It turns the distance between an advertised context window and a usable one into a number, which is the quantity every long-context design in Part II should be measured against. Long-context model reports now quote RULER where a single needle test would once have been enough.

### [HELMET](https://arxiv.org/abs/2410.02694) (2024)

*How to Evaluate Long-Context Language Models Effectively and Thoroughly*

**Background.** Long-context evaluation had two kinds of test. Synthetic probes such as needle retrieval are cheap to generate at any length and easy to score, so they are what model reports quote. Real application tasks are neither cheap nor uniform in length.

**Problem.** A benchmark is only useful if it predicts the thing you care about, and synthetic needle tests do not. Near-perfect needle scores sit alongside large gaps on tasks that need the whole context at once, so passing the probe buys you nothing about downstream behavior.

**Key idea.** Seven application-centric categories, controllable lengths to 128K, and model-based metrics in place of string matching, run over 59 models so the categories can be compared against each other instead of reported one at a time.

**Why it matters.** It gives you the habit of asking what a long-context evaluation predicts before quoting it, and it is the evaluation suite behind Princeton's ProLong long-context training recipe. A training recipe tuned against a needle score is tuning for the wrong thing.

### [judges saturate first](https://arxiv.org/abs/2601.19532) (2026)

*Benchmarks Saturate When The Model Gets Smarter Than The Judge*

**Background.** Open-ended benchmarks are scored by a model. A judge reads a candidate answer against a reference, decides whether it is correct, and the aggregate of those decisions becomes the number everyone reports.

**Problem.** That number carries two error sources which are usually collapsed into one, noise in the dataset and noise in the judge. When a benchmark stops separating strong models, you cannot tell whether the models have run out of headroom or the judge has run out of competence.

**Key idea.** Hand-audit Omni-MATH to separate benchmark error from judge error, then measure the latter.

**Findings.** Where two judges disagree, expert annotation finds the original automatic judge wrong in 96.4% of cases, and that happens well before the benchmark itself saturates.

**Why it matters.** The judge, not the task, is what saturates first, so a flat leaderboard is evidence about your grader before it is evidence about the models. Whenever a number comes from one model grading another, which now includes most agent evaluations, this is the failure mode to rule out first.

## Representative model reports

### [GPT-4](https://arxiv.org/abs/2303.08774) (2023)

*Technical Report*

**Background.** A frontier model release used to come with a paper describing the architecture, the data, and the training setup, because the point of publishing was that other people could reproduce the result or build on it.

**Problem.** Competitive and safety pressure pull the other way. The report states outright that it withholds architecture, model size, hardware, training compute, dataset construction, and training method, so a systems reader is handed capability numbers with nothing that explains them.

**Key idea.** What remains is evaluation and safety. Benchmark and professional-exam results, a demonstration that loss and some capabilities can be predicted from much smaller runs, and an account of the red-teaming and mitigation work behind the deployed system.

**Why it matters.** Read it next to Llama 3 and DeepSeek-V3 to see how much a closed report withholds, and what that costs a reader who wants to build. Its split of capability and safety detail from architecture is now the template for closed releases.

### [LLaMA](https://arxiv.org/abs/2302.13971) (2023)

*Open and Efficient Foundation Language Models*

**Background.** The scaling work of the time optimized training compute, so the recommended model for a given budget was as large as the token budget allowed. Frontier weights were closed, and the open alternatives were well behind them.

**Problem.** A serving budget is not a training budget. Once weights are deployed, the cost that dominates is inference on whatever model you ended up with, and the compute-optimal recipe hands you a model larger than you want to serve.

**Key idea.** Train smaller models on far more tokens than compute-optimal scaling calls for, using only publicly available data, and release the weights. The architecture stays plain, with pre-normalization and RMSNorm, SwiGLU activations, and rotary position embeddings.

**Why it matters.** This is the open-weight line the assignments run on, and the reason the course can hand you a real model to profile rather than an API. That RMSNorm, SwiGLU, and rotary stack is the template Mistral, Qwen, and Gemma still follow, so a kernel you read here transfers to most open models.

### [Llama 2](https://arxiv.org/abs/2307.09288) (2023)

*Open Foundation and Fine-Tuned Chat Models*

**Background.** The first LLaMA release gave you a base model, weights that predict the next token and nothing more. Turning one into an assistant that follows instructions and declines harmful requests was a separate recipe, and the labs that had one kept it private.

**Problem.** Base weights are not a product. Alignment needs preference data, reward models, and a policy-optimization loop, and the license on the earlier weights barred commercial use, so nobody could ship what they built on them.

**Key idea.** Publish the aligned half. Supervised fine-tuning followed by reinforcement learning from human feedback, with separate reward models for helpfulness and safety, documented at the level of a recipe, and released under a license that permits commercial use.

**Why it matters.** It is the release that made open-weight serving mainstream, so the deployment questions in this course have real systems behind them. Hugging Face's chat templates and TRL's preference-tuning pipelines were built around this recipe, and the 70B model's grouped-query attention is now the default attention layout in open models.

### [Llama 3](https://arxiv.org/abs/2407.21783) (2024)

*The Llama 3 Herd of Models*

**Background.** Frontier model reports before this one published architecture, data description, and evaluation scores, and said almost nothing about the infrastructure a run of that size actually required. The GPT-4 report above is the reference point.

**Problem.** Without failure data from a real run, you cannot reason about what a training cluster has to survive. How often components fail, which ones fail, and what a job does when they do are the numbers that decide whether a run finishes at all.

**Key idea.** Publish the infrastructure. Section 3 describes a 16K-GPU training run, the failure rates observed during it, and the parts of the stack that break at that scale, sitting next to the usual architecture and data sections.

**Why it matters.** It is the most detailed open account of a frontier training run, so it is where reliability at scale stops being an assumption and becomes arithmetic. It also fixes a baseline for the course, since Llama 3 8B and 70B are the open models most serving results are quoted against.

### [Mistral 7B](https://arxiv.org/abs/2310.06825) (2023)

*Mistral 7B*

**Background.** Attention over a full sequence costs both compute and a KV cache that every layer keeps for every token. In a small model that cache, rather than the weights, is what fills the GPU as prompts get longer.

**Problem.** A 7B model fits on one GPU, but full attention over a long prompt lets the KV cache grow with the prompt, which caps both the context length you can offer and the number of concurrent requests a server can hold.

**Key idea.** Restrict each layer's attention to a sliding window of recent tokens and hold the cache in a fixed-size rolling buffer. Information still travels further than one window, because it advances one window per layer, while per-layer memory stays constant in prompt length.

**Why it matters.** It is a 7B-class model in exactly the size range Assignment 4 targets, and the cheapest place to see a bounded-cache decision made inside a shipped model. Sliding-window attention is now a standard option in Hugging Face Transformers, vLLM, and FlashAttention kernels, so the choice returns later as a flag you set.

### [Gemma 3](https://arxiv.org/abs/2503.19786) (2025)

*Gemma 3 Technical Report*

**Background.** A long-context model pays for context twice, once in attention work and once in a KV cache that every global attention layer must keep for every token it has seen.

**Problem.** At a 128K-token context the cache, not the parameters, decides how many requests a server can hold. A 1B model carrying a full 128K cache per layer is no longer a small model in the sense that matters for deployment.

**Key idea.** Interleave the attention layers, raising the ratio of local layers to global ones and keeping the local span short. Only the few global layers retain a cache proportional to the whole context. The family runs from 1B to 27B parameters, is multimodal, and supports at least 128K tokens.

**Why it matters.** This is a model report whose headline architecture change is a serving decision. Per-layer cache footprint, rather than parameter count, is what you size a deployment against, and here you can see a family shaped around that fact.

### [gpt-oss](https://arxiv.org/abs/2508.10925) (2025)

*gpt-oss-120b & gpt-oss-20b Model Card*

**Background.** An agent-serving stack does more than generate tokens. It parses what the model emits into tool calls, feeds tool results back into the conversation, and has to do both in the exact format the model was trained on.

**Problem.** Open weights alone do not specify that format. Without the chat template, the tokenizer, and the tool-call grammar, a server either guesses the conventions or reimplements them per model, and interleaved reasoning traces make the boundaries harder to find.

**Key idea.** Release the mixture-of-experts reasoning weights together with inference implementations, tool environments, and tokenizers under Apache 2.0, and write down the harmony chat format explicitly. The tool-use and chat-format sections are the ones to read.

**Why it matters.** Those sections are the part of a model report that most directly constrains an agent-serving system. A chat format is an interface, and this is where you can see that a model's interface, not only its quality, sets what a serving stack must implement.

### [Kimi K2](https://arxiv.org/abs/2507.20534) (2025)

*Open Agentic Intelligence*

**Background.** Training at trillion-parameter scale runs into loss spikes, which are divergences that force a rollback to an earlier checkpoint and re-spend every GPU-hour since. Optimizer choice is one of the levers on how often they happen.

**Problem.** Muon is more compute-efficient than AdamW at scale, but attention logits can grow until the run destabilizes. One spike late in a 15.5T-token pretraining run is expensive enough that stability becomes a systems constraint rather than a detail.

**Key idea.** MuonClip adds a QK-clip technique to Muon, rescaling the query and key projections so attention logits stay bounded. The 1T-parameter model activates 32B parameters per token and is followed by agentic data synthesis and joint reinforcement learning stages.

**Findings.** The 15.5T-token pretraining run completed with zero loss spikes.

**Why it matters.** The report is unusually direct about the instability it engineered around and about the post-training stages that follow, which is what makes it worth reading next to a report that lists only scores. Stability, routing, and rollout infrastructure are systems problems, and this report treats them as such.

### [GLM-4.5](https://arxiv.org/abs/2508.06471) (2025)

*Agentic, Reasoning, and Coding (ARC) Foundation Models*

**Background.** Model reports have been organized around suites of language understanding and generation benchmarks, with tool use and agentic behavior reported, when reported at all, as one more column in the table.

**Problem.** An agentic workload is a different systems problem from single-turn generation. Long trajectories, tool calls, and the question of whether to spend tokens on reasoning at all change what a server schedules, and a model evaluated as a text generator tells you nothing about that.

**Key idea.** Train one set of weights for agentic, reasoning, and coding work together, with a thinking mode and a direct-response mode in the same model. The main model has 355B total parameters with 32B activated and was trained over 23T tokens; a 106B Air variant provides a smaller point on the same ladder.

**Findings.** The main model reports 70.1% on TAU-Bench, 91.0% on AIME 24, and 64.2% on SWE-bench Verified.

**Why it matters.** It is the clearest statement of the claim that agentic capability is now what a model report is organized around. Two modes in one set of weights also pushes a routing decision into the serving stack. The reinforcement learning infrastructure behind the run shipped as slime, which pairs Megatron-LM with SGLang rollouts.

### [GLM-5](https://arxiv.org/abs/2602.15763) (2026)

*from Vibe Coding to Agentic Engineering*

**Background.** Reinforcement learning on agentic tasks generates its own training data. Each rollout is a full serving workload, and in a synchronous loop the trainer waits for the slowest trajectory in the batch before it can take a step.

**Problem.** Long-horizon interactions make that wait the dominant cost, and long contexts make every rollout expensive to generate and to train on. The two costs compound, so a fast trainer paired with a synchronous rollout loop is mostly idle.

**Key idea.** Decouple generation from training in an asynchronous reinforcement learning stack, add asynchronous agent RL algorithms for long-horizon interactions, and adopt sparse attention to cut training and inference cost while holding long-context fidelity.

**Why it matters.** Read it with the agent-serving meetings, because an asynchronous rollout system is a serving system with a training job attached. The asynchronous rollout design is what verl, slime, and AReaL implement for open RL training, and the sparse attention descends from DeepSeek's NSA.

### [Kimi K3](https://arxiv.org/abs/2607.24653) (2026)

*Open Frontier Intelligence*

**Background.** A sparse mixture-of-experts model at this scale spreads its experts across devices, so throughput depends on how evenly tokens route and how much activation memory each stage holds. Attention over a million-token context is a separate cost on top of that.

**Problem.** Three costs have to be solved at once. Routing 16 of 896 experts per token unbalances the expert-parallel schedule, a one-million-token context will not fit as full attention, and agentic reinforcement learning has to keep rollout and sandbox state alive across very long episodes.

**Key idea.** Co-design the algorithm with the system. Kimi Delta Attention is built together with its kernels, expert-parallel training is balanced through explicit memory management, and million-token agentic reinforcement learning retains persistent rollout and sandbox state. The multimodal model has 2.8T total parameters with 104B activated per token.

**Findings.** The report attributes roughly 2.5× greater scaling efficiency than Kimi K2 to the combined architecture and systems design.

**Why it matters.** The systems content is the reason to read it. Attention mechanism, parallelism plan, and RL infrastructure are one design rather than three, which is the case for co-design made at frontier scale. Kimi Delta Attention arrived earlier in the Kimi Linear models, and the same gated delta-rule layer is what Qwen3-Next uses and vLLM serves.

### [Gemma 4](https://arxiv.org/abs/2607.02770) (2026)

*Gemma 4 Technical Report*

**Background.** Multimodal models normally put a separate encoder in front of the language model for each modality, a vision tower and an audio tower, each with its own weights and its own preprocessing stage.

**Problem.** Every extra encoder is another model to load, schedule, and hold in memory, and it fixes the input representation before the language model sees anything. On a device with one accelerator and a fixed memory budget, that cost is charged against the model you wanted to run.

**Key idea.** Feed raw audio and image patches into the model directly. The family spans 2.3B to 31B parameters in dense and mixture-of-experts form, is natively multimodal, has a thinking mode, and includes an encoder-free 12B variant built on that direct path.

**Why it matters.** It supersedes the Gemma 3 entry above as the size ladder to reach for when a project needs models that fit on one GPU across a wide range. The encoder-free path continues Gemma 3n, the line Google ships on-device, so this is where a deployment constraint visibly changes an architecture.

### [Qwen3.5](https://qwen.ai/blog?id=qwen3.5) (2026)

*Model Release Report*

**Background.** Qwen3 and Qwen3-Next appear earlier in this group, and the Qwen3-Next report documents its architecture more completely than a release post normally does.

**Problem.** A release report is written for adopters rather than for systems readers. It states capabilities and discloses the architecture only partly, so the details a serving stack needs are not the ones it foregrounds.

**Key idea.** The report is organized around reasoning, native multimodality, and agentic tool use rather than text benchmarks alone, and its deployment and prompting sections state the operational contract the model exposes to an agent runtime.

**Why it matters.** Read the deployment and prompting sections as the interface a serving stack has to honour, then compare the disclosed architecture against the fuller Qwen3-Next report to see what a release report leaves out.

### [MiniMax-M2.5](https://www.minimax.io/news/minimax-m25) (2026)

*Model Release Report*

**Background.** M2 established MiniMax's agentic line, and this release updates it around coding and long-horizon tool use.

**Problem.** An agentic workload does not look like the one throughput benchmarks assume. Long decode phases alternate with tool execution while the history grows, so tokens per second stops describing what the user waits for.

**Key idea.** The useful systems content is the workload rather than a new attention mechanism. The report describes end-to-end coding and tool-use tasks with long interaction histories, which makes completion time and cost per solved task the units that matter.

**Why it matters.** It gives you the shape of the request stream the agent-serving meetings later have to schedule, and it is a concrete argument for measuring per solved task rather than per token under production conditions.

### [Claude Opus 4.6](https://www.anthropic.com/news/claude-opus-4-6) (2026)

*System Card and Model Report*

**Background.** GPT-4, near the start of this group, set the pattern for a closed model report: capabilities and safety evaluation, with architecture and training cost withheld.

**Problem.** A report that withholds the system tells you nothing directly about serving it. What it can still reveal is the demand, and only then if the workload it describes is stated concretely.

**Key idea.** The report centres on coding, computer use, long-context work, and safety evaluation, and it describes agentic tasks that unfold across substantially longer interaction histories than earlier closed reports did.

**Why it matters.** Read it beside GPT-4 for the contrast. It reveals more about the requests a serving system must sustain than about the system that serves them, and for this course that is the more useful half.
