import type { ReactNode } from "react";

export type ArchivePost = {
  slug: "capsule" | "rainbow";
  title: string;
  date: string;
  authors?: string;
  tags: string[];
  body: ReactNode;
};

const GH = "https://raw.githubusercontent.com/www0wwwjs1/Matrix-Capsules-EM-Tensorflow/bd5d2c6d/imgs";

export const ARCHIVE_POSTS: ArchivePost[] = [
  {
    slug: "capsule",
    title: "Matrix Capsule With EM Routing Reproduce Report",
    date: "2017-12-17",
    authors: "Hang Yu | Suofei Zhang",
    tags: ["Research Implementation"],
    body: (
      <>
        <p>Author: Hang Yu | Suofei Zhang</p>
        <p>Email: hangyu5 at illinois.edu | zhangsuofei at njupt.edu.cn</p>
        <h2>Introduction to Capsule</h2>
        <p>
          Capsule can be perceived as an extension of perceptron. A capsule is able in take an tensor as input and
          output an another tensor. The output tensor is called a pose. The activation of an capsule is usually the
          norm of a certain dimension of the pose, or it could be generated independently for this pose alone. The
          activation represents the existence of certain feature. A capsule layer carries both the pose and its
          activation to the next capsule layer.
        </p>
        <p>
          A deeper capsule doesn’t just simply read the output of a previous capsule layer. The poses and activations
          have to walk through a unsupervised learning procedure called “routing by agreement”. It allows training to
          learn from the distribution of input values by taking advantage of unsupervised learning methods. So that the
          training (i.e. supervised learning, e.g. image classification) is not longer dictated by the loss function
          alone, meaning the loss function (defined by us) and the data (defined by nature, collected by us) together
          contribute to the learning process.
        </p>
        <p>
          However, even though the capsule is a more exciting algorithm than its counterpart CNN. The CNN baseline is
          well implemented mostly which enables it to train faster in the physical world than the capsule net. We will
          leave the discussion to expert in this field.
        </p>
        <p>Abstract, introduction and contribution of [1] can be found in its paper. Details for our implementation can be found in [2].</p>
        <h2>Code of Conduct</h2>
        <blockquote>
          <p>
            Participants should produce a Reproducibility report, describing the target questions, experimental
            methodology, implementation details, analysis and discussion of findings, conclusions on reproducibility of
            the paper. This report should be posted as a contributed review on OpenReview.
            The result of the reproducibility study should NOT be a simple Pass / Fail outcome. The goal should be to
            identify which parts of the contribution can be reproduced, and at what cost in terms of resources
            (computation, time, people, development effort, communication with the authors).
          </p>
          <p>
            Participants should expect to engage in dialogue with ICLR authors through the OpenReview site. In cases
            where participants have made significant contributions to the final paper, ICLR should allow adding these
            participants as co-authors (at the request of the original authors only.)
          </p>
        </blockquote>
        <h2>Reproduce Method</h2>
        <h3>Hyperparameters</h3>
        <p>smallNORB dataset:</p>
        <ul>
          <li>Samples per epoch: 46800</li>
          <li>Sample dimensions: 96x96x1</li>
          <li>Batch size: 50</li>
          <li>
            Preprocessing:
            <ul>
              <li>
                training:
                <ol>
                  <li>add random brightness with max delta equals 32 / 255.</li>
                  <li>add random contrast with lower 0.5 and upper 1.5.</li>
                  <li>resize into HxW 48x48 with bilinear method.</li>
                  <li>crop into random HxW 32x32 piece.</li>
                  <li>apply batch norm to have zero mean and unit variance.</li>
                  <li>squash the image from 4 so that each entry has value from 0 to 1. This image is to be compared with the reconstructed image.</li>
                </ol>
              </li>
              <li>
                testing:
                <ol>
                  <li>resize into HxW 48x48 with bilinear method.</li>
                  <li>crop the center HxW 32x32 piece.</li>
                  <li>apply batch norm with moving mean and moving variance collected from training data set.</li>
                </ol>
              </li>
            </ul>
          </li>
        </ul>
        <h3>Method</h3>
        <ol>
          <li>
            The so called dynamic routing is in analog to the fully-connected layer in CNN. The so called ConvCaps
            structure extends dynamic routing into convolutional filter structure. The ConvCaps are implemented similarly
            as the dynamic routing for the whole feature map. The only difference is to tile the feature map into
            kernel-wise data and treat different kernels as batches. Then EM routing can be implemented within each
            batch in the same way as dynamic routing.
          </li>
          <li>
            Different initialization strategies are used for convolutional filters. Linear weights are initialized with
            Xavier method. Biases are initialized with truncated normal distribution. This configuration provide higher
            numerical stability of input to EM algorithm.
          </li>
          <li>
            The output of ConvCaps2 layer is processed by em routing with kernel size of 1*1. Then a global average
            pooling is deployed here to results final Class Capsules. Coordinate Addition is also injected during this
            stage.
          </li>
          <li>
            Equation 2 in E-step of Procedure 1 from original paper is replaced by products of probabilities directly.
            All the probabilities are normalized into [0, 10] for higher numerical stability in products. Due to the
            division in Equation 3, this operation will not impact the final result. Exponent and logarithm are also used
            here for the same purpose.
          </li>
          <li>
            A common l2 regularization of network parameters is considered in the loss function. Beside this,
            reconstruction loss and spread loss are implemented as the description in the original paper.
          </li>
          <li>Learning rate: starts from 1e-3, then decays exponentially in a rate of 0.8 for every 46800/50 steps, and ends in 1e-5 (applied for all trainings).</li>
          <li>We use Tensorflow 1.4 API and python programming language.</li>
        </ol>
        <h2>Reproduce Result</h2>
        <h3>Overview</h3>
        <p>Experiments on is done by Suofei Zhang. His hardware is:</p>
        <ul>
          <li>cpu：Intel(R) Xeon(R) CPU E5-2680 v4@ 2.40GHz</li>
          <li>gpu：Tesla P40</li>
        </ul>
        <p>
          <strong>On test accuracy</strong>:
        </p>
        <p>smallNORB dataset test accuracy (our result/proposed result):</p>
        <ul>
          <li>CNN baseline (4.2M): 88.7%(best)/94.8%</li>
          <li>Matrix Cap with EM routing (310K, 2 iteration): 91.8%(best)/98.6%</li>
        </ul>
        <p>There are two comments to make:</p>
        <ol>
          <li>Even though the best of Matrix Cap is over by 3% to the best of CNN baseline, the test curve suggest Matrix Cap fluctuates between roughly 80% to 90% test dataset.</li>
          <li>We are curious to know the learning curve and test curve that can be generated by the author.</li>
        </ol>
        <p>
          <strong>Training speed</strong>:
        </p>
        <ol>
          <li>CNN baseline costs 6m to train 50 epochs on smallNORB dataset. Each batch costs about 0.006s.</li>
          <li>Matrix Cap costs 15h55m36s to train. Each batch costs about 1.2s.</li>
        </ol>
        <p>
          <strong>Recon image</strong>: Will come soon.
        </p>
        <p>
          <strong>routing histogram</strong>: We have difficulty in understanding how the histogram is calculated.
        </p>
        <p>
          <strong>AD attack</strong>: We haven’t planned to run AD attack yet.
        </p>
        <h3>Notes</h3>
        <blockquote>
          <p>
            <strong>Status:</strong>
            According to github commit history, this reproduce project had its init commit on Nov.19th. We started writing
            this report on Dec.19th. Mainly, it is cost by undedicated code review so that we have to fix bug and run it
            again, otherwise the project should be able to finish in a week.
          </p>
          <p>
            <strong>Current Results on smallNORB:</strong>
          </p>
          <ul>
            <li>
              Configuration: A=32, B=8, C=16, D=16, batch_size=50, iteration number of EM routing: 2, with Coordinate
              Addition, spread loss, batch normalization
            </li>
            <li>
              Training loss. Variation of loss is suppressed by batch normalization. However there still exists a gap
              between our best results and the reported results in the original paper.
            </li>
          </ul>
        </blockquote>
        <p>
          <img src={`${GH}/spread_loss_norb.png`} alt="spread loss on smallNORB" />
        </p>
        <ul>
          <li>
            Test accuracy (current best result is 91.8%)
            <img src={`${GH}/test_accuracy_norb.png`} alt="test accuracy on smallNORB" />
          </li>
        </ul>
        <blockquote>
          <p>
            <strong>Ablation Study on smallNORB:</strong>
          </p>
          <ul>
            <li>
              Configuration: A=32, B=8, C=16, D=16, batch_size=32, iteration number of EM routing: 2, with Coordinate
              Addition, spread loss, test accuracy is 79.8%.
            </li>
          </ul>
          <p>
            <strong>Current Results on MNIST:</strong>
          </p>
          <ul>
            <li>
              Configuration: A=32, B=8, C=16, D=16, batch_size=50, iteration number of EM routing: 2, with Coordinate
              Addition, spread loss, batch normalization, reconstruction loss.
            </li>
          </ul>
        </blockquote>
        <p>
          Training loss.
          <img src={`${GH}/training_loss.png`} alt="MNIST training loss" />
        </p>
        <p>
          Test accuracy (current best result is 99.3%, only 10% samples are used in test)
          <img src={`${GH}/test_accuracy.png`} alt="MNIST test accuracy" />
        </p>
        <h2>Reference</h2>
        <p>
          [1]{" "}
          <a href="https://openreview.net/pdf?id=HJWLfGWRb" target="_blank" rel="noopener">
            MATRIX CAPSULES WITH EM ROUTING (paper)
          </a>
        </p>
        <p>
          [2]{" "}
          <a href="https://github.com/www0wwwjs1/Matrix-Capsules-EM-Tensorflow/" target="_blank" rel="noopener">
            Matrix-Capsules-EM-Tensorflow (our github repo: code and comments)
          </a>
        </p>
      </>
    ),
  },
  {
    slug: "rainbow",
    title: "DeepMind Rainbow: Review",
    date: "2017-12-16",
    tags: ["NNArchitecture"],
    body: (
      <>
        <h2>Introduction</h2>
        <p>
          Since the publication of{" "}
          <a href="https://www.cs.toronto.edu/~vmnih/docs/dqn.pdf" target="_blank" rel="noopener">
            Playing Atari with Deep Reinforcement Learning
          </a>
          , there are six extensions (彩虹) further developed by DeepMind:
        </p>
        <ol>
          <li>
            <a href="https://arxiv.org/pdf/1509.06461.pdf" target="_blank" rel="noopener">
              Deep Reinforcement Learning with Double Q-learning - 2015
            </a>
          </li>
          <li>
            <a href="https://arxiv.org/pdf/1511.05952.pdf" target="_blank" rel="noopener">
              Prioritized Experience Replay - 2015
            </a>
          </li>
          <li>
            <a href="https://arxiv.org/pdf/1511.06581.pdf" target="_blank" rel="noopener">
              Dueling Network Architectures for Deep Reinforcement Learning - 2015
            </a>
          </li>
          <li>
            <a href="https://arxiv.org/pdf/1602.01783.pdf" target="_blank" rel="noopener">
              Asynchronous Methods for Deep Reinforcement Learning 2016
            </a>
          </li>
          <li>
            <a href="https://arxiv.org/pdf/1706.10295.pdf" target="_blank" rel="noopener">
              Noisy Networks for Exploration - 2017
            </a>
          </li>
          <li>
            <a href="https://arxiv.org/pdf/1707.06887.pdf" target="_blank" rel="noopener">
              A Distributional Perspective on Reinforcement Learning - 2017
            </a>
          </li>
        </ol>
        <p>
          The Oct.6th published article —{" "}
          <a href="https://arxiv.org/pdf/1710.02298.pdf" target="_blank" rel="noopener">
            Rainbow: Combining Improvements in Deep Reinforcement Learning
          </a>{" "}
          tries combine the above six method together. It shows promising and expected result. More interestingly,
          figure 3 revels the marginal improvement offered by each extension:
        </p>
        <h2>Which extension is outstanding?</h2>
        <p>The original Figure 3 host (jianshu) is dead. The argument from that figure stands:</p>
        <ul>
          <li>N-step return, prioritized replay and distributional Bellman generate the biggest marginal improvement individually.</li>
          <li>Dueling and Double Q offer the smallest improvement among all extensions.</li>
        </ul>
        <p>We know that:</p>
        <ul>
          <li>Dueling is a method to decompose state-action value in order to the concept of advantage.</li>
          <li>Double Q is a counter method for overestimating state-action value.</li>
          <li>Basically Dueling and Double Q are dealing with the same issue – better estimate the Q value with its defined target (i.e. to reduce variance and bias).</li>
        </ul>
        <p>We also know that:</p>
        <ul>
          <li>N-step return helps the RL agent learn from a policy that result in the best future n step return.</li>
          <li>Prioritized replay tracks rare reward signals that help quicker learning.</li>
          <li>Distributional Bellman equation treat the “value function” as a distribution of rewards.</li>
          <li>These three extension aim to create/select a better target for the action-value function to learn.</li>
        </ul>
        <h2>Conclusion</h2>
        <p>
          With that said, combining the result of Fig3, we are able to conclude that for a value-based method: Having
          better target to learn is generally more effective than learning target better.
        </p>
        <p>Further, adding a final noisy dense layer does help exploring (i.e. finding better target to learn) in general.</p>
        <p>
          Also, Figure 1 shows prioritized DQN, and Distributional DQN are about the same level. DDQN aided by Dueling
          is better than plain DDQN. Besides plain DDQN &gt; plain DQN, this implies Dueling and Double Q (both are
          learning target better method) are good combination, but Dueling DDQN barely matches prioritized DQN, and
          Distributional DQN (which are learning better target).
        </p>
        <p>
          And going back to Figure3, <strong>it seems like Rainbow only needs one “learning target better” method</strong>.
          And it would be interesting to see how Rainbow performs without Dueling &amp; Double Q.
        </p>
      </>
    ),
  },
];

export function getArchivePost(slug: string | undefined): ArchivePost | undefined {
  return ARCHIVE_POSTS.find((post) => post.slug === slug);
}
